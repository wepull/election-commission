(function (window) {
  window["env"] = window["env"] || {};

  // Environment variables
  var ecServerEndpointEnvVar = `$EC_SERVER_ENDPOINT`;
  window["env"]["ecServerEndpoint"] = ecServerEndpointEnvVar.replace(
    /['"]/gi,
    ""
  );
})(this);
