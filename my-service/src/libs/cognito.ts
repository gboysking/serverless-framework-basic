import axios from "axios";

export let getUserInfo = (userPoolDomain: string, accessToken:string): Promise<any> => {
    return new Promise((resolve, reject) => {
      axios.get(`https://${userPoolDomain}/oauth2/userInfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
            console.log(error);
          reject(error);
        });
    });
  }