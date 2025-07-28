function handler(event) {
  var request = event.request;
  var headers = request.headers;

  var group = Math.random() < 0.5 ? "A" : "B";

  if (headers.cookie && headers.cookie.value.includes("group=B")) {
    group = "B";
  }

  request.uri = group === "A" ? "/index-example.html" : "/index-example-v2.html";
  return request;
}
