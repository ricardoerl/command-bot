const env = require('dotenv').config();
const Twit = require('twit');

function init() {
  // twit configuration

  if (env.error) return console.error('No env file found');

  const T = new Twit({
    consumer_key: process.env.API_KEY,
    consumer_secret: process.env.API_SECRET_KEY,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  });

  // twit stream

  const stream = T.stream('statuses/filter', { track: '#SeLeOrdena' });

  // stream events

  stream.on('tweet', onTweeted);
  stream.on('error', onError);
}

// * BOT CONFIGURATION

// @profile templating

const screen_name_template_key = '@USER';

// posible bot replies

const REPLY_TEMPLATES = [
  'Enterado presidente @USER se cumplirá su orden.',
  'Con gusto Presidente @USER, mañana a primera hora.',
  'Enterado presidente, @USER se procederá conforme a su orden.',
  'Señor Presidente @USER le informo que su instruccion ya fue cumplida.',
  'Así se hará, cuanto antes presidente @USER.',
  'Gracias por su confianza, señor Presidente @USER. En 15 días tendrá el plan en su despacho.',
  '@USER Instruccion recibida Señor Presidente.',
  'A la orden Señor Presidente @USER.',
  'Con todo gusto Presidente @USER, el día lunes daremos inicio al programa.',
  'Ya en camino a dar cumplimiento a esa promesa Presidente @USER.',
  '@USER En este momento Presidente.',
  '@USER Ejecutado Señor Presidente.',
  '@USER De inmediato Presidente.',
  '@USER Así será señor Presidente.',
  'Equipos activados Presidente @USER y elaborando plan de distribución.',
  '@USER De acuerdo, presidente, como ordene.',
  '@USER En estos momentos procedo Presidente.',
  'Su orden se ejecutará, Presidente @USER.',
  '@USER Presidente, considérelo hecho.',
  'Ahorita mismo Presidente @USER.',
  '@USER Su orden será cumplida de inmediato Presidente.',
  '@USER Esta hecho Presidente.',
];

// bot methods

function onTweeted(event) {
  const {
    id_str,
    user: { screen_name },
  } = event;
  console.log('Tweet found from @', screen_name);
  const response = parseResponse(screen_name);

  // Send response
  T.post(
    'statuses/update',
    {
      status: response,
      in_reply_to_status_id: id_str,
    },
    onReplied,
  );
}

function onError(error) {
  console.log('Error on stream:', error);
  throw error;
}

function onReplied(error, reply) {
  if (error !== undefined) {
    console.log('Error on reply:', error);
  } else {
    console.log('Tweet sent:', reply.text);
  }
}

function parseResponse(user) {
  const randomIndex = Math.floor(REPLY_TEMPLATES.length * Math.random());
  //Gaps index to be in range [ 0 , REPLY_TEMPLATES.length - 1 ]
  const responseTemplate = REPLY_TEMPLATES[randomIndex];
  return responseTemplate.replace(screen_name_template_key, `@${user}`);
}

// bot start point

init();

// exporting needed data for testing
module.exports = {
  parseResponse,
};
