const { Router } = require('express');
const router = Router();
const bodyParser = require('body-parser');

router.get('/', (req, res) => {
  res.render('reception', {
    title: 'Онлайн-приемная',
  });
});

router.post('/appeal', bodyParser(), async (req, res) => {
  console.log(req.body);
  if (
    req.body.name.length != 0 ||
    req.body.phone.length != 0 ||
    req.body.question.length != 0 ||
    req.body.email.length != 0 ||
    req.body.address.length != 0 ||
    req.body.deput.length != 0
  ) {
    try {
      const message = `
        <h2>Обращение с сайта gorsovet-26.ru</h2>
        <hr>
        <p>
          <b>Кому: </b>
          ${req.body.deput}
        </p>
        <hr>
        <p>
          <b>Имя: </b>
          ${req.body.name}
        </p>
        <hr>
        <p>
          <b>Телефон: </b>
          ${req.body.phone}
        </p>
        <hr>
        <p>
          <b>Email: </b>
          ${req.body.email}
        </p>
        <hr>
        <p>
          <b>Адрес: </b>
          ${req.body.address}
        </p>
        <hr>
        <p>
          <b>Текст обращения: </b>
          ${req.body.question}
        </p>
        <hr>
      `;
      await sendQuestion(message);
      res.send('1');
    } catch (err) {
      console.log(err);
    }
  } else {
    res.send('0');
  }
});

module.exports = router;
