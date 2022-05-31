const {
  shipnewProduct,
  getProducts,
  getProductWithID,
  updateProduct,
  deleteProduct
} = require ('../controllers/apiController');

const routes = (app) => {
    app.route('/products')
        .all((req,res, next) => {
          let company = req.body.company
          if (!company || company.length === 0 ) {
            res.json({msg: 'Company name is required. Pls provide full data.'})
          } else {
            next()
          }
        })
        .get(getProducts)
        .post(shipnewProduct);

    app.route('/product')
        // routes for a specific product
        .all((req,res, next) => {
          let product = req.body.product_id
          if (!product || product.length === 0 ) {
            res.json({msg: 'Product id is required. Pls provide full data.'})
          } else {
            next()
          }
        })
        .get(getProductWithID)
        .put(updateProduct)
        .delete(deleteProduct)
}

module.exports = routes;
