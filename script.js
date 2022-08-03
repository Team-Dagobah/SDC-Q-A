import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  insecureSkipTLSVerify: true,
  stages: [
    { duration: '10s', target: 10 },
    { duration: '10s', target: 50 },
    { duration: '10s', target: 100 },
    { duration: '10s', target: 200 },
    { duration: '10s', target: 250 },
    { duration: '10s', target: 300 },
    { duration: '10s', target: 400 },
    { duration: '10s', target: 400 },
    { duration: '30s', target: 0 },
  ]
}

export default function () {
  var domain = 'http://localhost:3000/qa/questions'
  // var product_id = Math.floor(Math.random()*3518963) // random product
  var product_id = Math.floor(Math.random()*518963 + 3000000) // random product from end of database

  var res = http.get(domain  + `?product_id=${product_id}`);
  check(res, {
    'status 200': (r) => r.status === 200,
    'recieved data': (r) => r.body !== undefined
  });
  sleep(.1);


  // http.get(domain + '?product_id=5')
}

