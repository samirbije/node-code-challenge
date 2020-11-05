const axios = require('axios');

/* 
Service Class that provides functionality
related to data loading
*/
class DataLoadService {
  /*
    Function to fetch data from the given data APIs
    Two different data sources are requested on parallel without block
    using Promise.all
    Returns all the assembled data 
   */
  fetchData() {
    return new Promise((resolve, reject)=> {
      console.log("Fetching Data Before Starting Server!!!");
      let users_url = process.env.USERS_DATA_URL;
      let profile_url = process.env.PROFILE_DATA_URL;

      // make parallel api requests on multiple source
      Promise.all([this.callApi(users_url), this.callApi(profile_url)])
      .then((results)=>{
        //console.log(results[0].data) 

        let users = {};
        let profiles = {};

        // storing to a hashmap makes subsiquent data search on valid user fast
        results[0].data.forEach(
          (user)=>{
            users[user.username] = user // assuming usernames are unique keys
          }
        );
        
        // storing to a hashmap makes later data search on user profile fast
        results[1].data.forEach(
          (profile)=>{
            profiles[profile.userUid] = profile
          }
        );

        let data = {
          users,
          profiles
        }
        resolve(data);
      })
      .catch((err)=>{
        console.log("Error fetching data from Api");
        reject(err);
      })
    })
  }

  /* 
  Helper Function to use for making REST
  API requests
  */
  callApi(url) {
    return new Promise((resolve, reject) => {
      axios.get(url)
        .then(function (response) {
          //console.log(response);
          resolve(response);
        })
        .catch(function (error) {
          reject(error);
        })
    }) 
  }
}

module.exports = DataLoadService;