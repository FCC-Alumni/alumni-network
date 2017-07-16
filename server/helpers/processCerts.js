import axios from 'axios';
import { isAllowedForDev } from '../../server';

import {
  getBackEndCert,
  getDataVisCert,
  getFrontEndCert
} from './getCerts';

export default (username, isHonoraryMember, isWhitelistedUser) => {

  console.log('processing verification for ' +
    `${isHonoraryMember ? 'honorary member' : ''}` +
    // eslint-disable-next-line
    `${isWhitelistedUser ? 'white-listed user' : ''}` + ` ${username}`);

  return axios.all([
    getFrontEndCert(username),
    getBackEndCert(username),
    getDataVisCert(username)
  ]).then(axios.spread((frontCert, backCert, dataCert) => {
    let totalRedirects =
    frontCert.request._redirectCount +
    backCert.request._redirectCount +
    dataCert.request._redirectCount;
    if (isHonoraryMember || totalRedirects < 3) {
      return {
        Back_End: backCert.request._redirectCount === 0 ? true : false,
        Data_Visualization: dataCert.request._redirectCount === 0 ? true : false,
        Front_End: frontCert.request._redirectCount === 0 ? true : false
      };
    } else if (isAllowedForDev) {
        return {
          Back_End: false,
          Data_Visualization: false,
          Front_End: false
        };
      } else {
        return false;
      }
  }));
};
