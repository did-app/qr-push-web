import replace from 'rollup-plugin-replace';

const {API_HOST} = process.env
if (!API_HOST) {
  throw "API_HOST is a required"
}

export default {
  plugins: [
    replace({
      ENV_API_HOST: API_HOST
    })
  ]
}
