
const redis = require("redis")
const Bluebird = require('bluebird')

const {
  REDIS_HOST,
  REDIS_PORT,
} = process.env;

const options = {
  host: REDIS_HOST,
  port: REDIS_PORT
}

class RedisServer {

  constructor() {
    this.client = null;
  }

  async connect() {
    this.client = redis.createClient(options);
    this.client.on('connect', () => console.log('Redis connected.') );
    Bluebird.promisifyAll (redis);
  }

  disconnect() {
    this.client.quitAsync().then(()=>{
      console.log('Redis disconnected.')
    }).catch((e)=>{
      console.error(e)
    })
  }

  async shipProduct (container, data) {

    try {
      await this.client.hsetAsync (container, 'container_id', container)
      //batch version: hmset
      Object.entries(data).forEach( async (entry) => {
          await this.client.hsetAsync (container, entry[0], entry[1])
      })
      //add company to db if doesn't exist
      await this.client.saddAsync('companies', data.company)
      //add item to company's list of items by container_id
      await this.client.saddAsync(data.company, container)
    } catch (e) {
      console.error(e)
    }
  }

  async getProducts (company) {

    try {
      //check if company in db
      let bool = await this.client.sismemberAsync('companies', company)
      if (bool) {
        let product_list =[]
        //get list of containers by company & push data to a list
        let company_containers = await this.client.smembersAsync(company)

        //for now, seqential loop run, can be improved to parallel with promises:
        //array.map(await Promise.all(promises))
        for (const container of company_containers) {
          let container_data = await this.client.hgetallAsync(container)
          product_list.push(container_data)
        }
        return product_list
      }
      return null
    } catch (e) {
      console.error(e)
    }
  }

  async getProduct (container) {

    try {
      //single product by container id
      return this.client.hgetallAsync(container)
    } catch (e) {
      console.error(e)
    }
  }

  async updateProduct (container, new_owner) {

    try {
      //update product's company ownership in 4 steps:
      let old_owner = await this.client.hgetAsync(container, 'company')
      //1) update container-data to new company owner
      //2) delete product from old owner's product list
      await this.client.hsetAsync(container, 'company', new_owner)
      await this.client.sremAsync(old_owner, container)
      //3) create new company in db if it doesn't exist
      //4) push container_id new company's product list
      await this.client.saddAsync('companies', new_owner)
      await this.client.saddAsync(new_owner, container)
    } catch (e) {
      console.error(e)
    }
  }

  async deleteProduct (container) {

    try {
      //delete product as key
      await this.client.delAsync(container)
      //aim: delete product from company's list
      //but first we need to find this company where container is
      let companies= await this.client.smembersAsync('companies')
      companies.forEach( async (company)=>{
        let bool = this.client.sismemberAsync(company, container)
        if (bool) await this.client.sremAsync(company, container)
      })
    } catch (e) {
      console.error(e)
    }
  }

}

module.exports = RedisServer;
