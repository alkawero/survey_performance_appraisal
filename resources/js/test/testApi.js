
const domain = 'http://localhost:8000/api/';

export function postTest(url,data){
    axios.post(domain+url, data)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
}

export function getTest(url){
    axios.get(domain+url)
    .then(function (response) {
        // handle success
        console.log(response);
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .then(function () {
        // always executed
    });
}
