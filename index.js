require('dotenv').config();
const Twit = require('twit');
const _ = require('lodash');

// twit configuration

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

// bot configuration
const REPLY_TEMPLATES = [
  'Enterado presidente @${ user } se cumplirá su orden.',
  'Con gusto Presidente @${ user }, mañana a primera hora.',
  'Enterado presidente, @${ user } se procederá conforme a su orden.',
  'Señor Presidente @${ user } le informo que su instruccion ya fue cumplida.',
  'Así se hará, cuanto antes presidente @${ user }.',
  'Gracias por su confianza, señor Presidente @${ user }. En 15 días tendrá el plan en su despacho.',
  '@${ user } Instruccion recibida Señor Presidente.',
  'A la orden Señor Presidente @${ user }.',
  'Con todo gusto Presidente @${ user }, el día lunes daremos inicio al programa.',
  'Ya en camino a dar cumplimiento a esa promesa Presidente @${ user }.',
  '@${ user } En este momento Presidente.',
  '@${ user } Ejecutado Señor Presidente.',
  '@${ user } De inmediato Presidente.',
  '@${ user } Así será señor Presidente.',
  'Equipos activados Presidente @${ user } y elaborando plan de distribución.',
  '@${ user } De acuerdo, presidente, como ordene.',
  '@${ user } En estos momentos procedo Presidente.',
  'Su orden se ejecutará, Presidente @${ user }.',
  '@${ user } Presidente, considérelo hecho.',
  'Ahorita mismo Presidente @${ user }.',
  '@${ user } Su orden será cumplida de inmediato Presidente.',
  '@${ user } Esta hecho Presidente.',
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
  const template = _.sample(REPLY_TEMPLATES);
  const compiled = _.template(template);
  return compiled({ user });
}
