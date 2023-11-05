function fn() {
  var env = karate.env; // get system property 'karate.env'
  karate.log('karate.env system property was:', env);
  if (!env) {
    env = 'local';
  }
  var config = {
    env: env,
    password: 'globalpassword23'
  }
  if (env == 'local') {
    config.apiUrl = "http://localhost:3000/"
  } else if (env == 'live') {
    config.apiUrl = "https://api.realworld.io/api"
  }

    var user1 = karate.callSingle('classpath:MediumClone/feature/createUser.feature', config)
    config.user1 = user1
    karate.log("created user xp:" + user1.username)
  return config;
}