var express = require('express');
var router = express.Router();
const Link = require('../models/link');

/* Acessa as estatísticas do código fornecido. */
router.get('/:code/stats', async (req, res, next) => {
  const code = req.params.code;
  const resultado = await Link.findOne({ where: { code } });
  if (!resultado) return res.sendStatus(404);
  res.render('stats', resultado.dataValues);
});

/* Acessa o codigo previamente criado, modifica as estatísticas e redireciona para a url apontada. */
router.get('/:code', async (req, res, next) => {
  const code = req.params.code;

  const resultado = await Link.findOne({ where: { code } });
  if (!resultado) return res.sendStatus(404);

  resultado.hits++;
  await resultado.save();
  if(resultado.url.indexOf('http') == -1) {
    res.redirect('http://' + resultado.url);
    next
  }
  else{
    res.redirect(resultado.url);
    next
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ZG - Encurtador' });
});

module.exports = router;

/* Gerador de código para encurtamento de url */
function generateCode() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

/* Recebe a url, cria o código de encurtamento e renderiza as estatísticas. */
router.post('/new', async (req, res, next) => {
  const url = req.body.url;
  const code = generateCode();
 
  const resultado = await Link.create({
    url,
    code
  })
  res.render('stats', resultado.dataValues);
});