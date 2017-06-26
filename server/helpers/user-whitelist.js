
/* ****************************************************
Whitelist legacy freeCodeCamp users so that they can join the app:

This only applies to users whose freeCodeCamp and GitHub
usernames are different. In that case we just update their
username to their freeCodeCamp username during the verification
process.

NOTE: This should be monitored to ensure it works correctly
if we actually have to use it for someone.
***************************************************** */

export const whitelist = {

  /* Format:
   * GitHub username: freeCodeCamp username
   */

   Rayhatron: 'rayhatron', // case discrepancy
   '3dw1nM0535': '3dw1nm0535', // case discrepancy

};

/* ****************************************************
Provided honorary access to certain FCC users:

This applies to certain users who for exceptional circumstances
should be able to join the network, but do not have any
certifications.
***************************************************** */

export const honoraryMembers = {

   /* Format:
   * username [ALL LOWERCASE LETTERS]: reason for membership (this is just for our record and has no function)
   */
   quincylarson: 'He founded freeCodeCamp',
   p1xt: 'Prolific freeCodeCamp community member',
   tropicalchancer: 'founder of chingu cohorts and FCCAN benefactor',
   imnotarealuser: 'test user. honoraryMembers list works now, but usernames must be all lowercase.',

};
