const filesController = require('../controllers/filesController');

const routes = [
  {
    method: 'GET',
    url: '/files',
    handler: filesController.get
  },
  {
    method: 'DELETE',
    url: '/files',
    handler: filesController.delete
  },
  {
    method: 'POST',
    url: '/files',
    handler: filesController.post
  }
]

module.exports = routes;