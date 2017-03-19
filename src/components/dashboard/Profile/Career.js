import React from 'react';

import MessageBox from '../../common/MessageBox';
import FormField from '../../common/FormField';
import RadioButton from '../../common/RadioButton';
import { Dropdown } from 'semantic-ui-react';

import { surveyOptions } from '../../../assets/data/dropdownOptions';

const Career = ({ toggle, showCareer, handleInputChange, handleTenureChange, isWorking, company, errors }) => {
  return (
    <div>
      <div className="ui teal ribbon label careerWrapper" onClick={() => { toggle('showCareer')}}>Career</div>
      <form className={`careerPane ui six wide form ${showCareer ? 'show' : 'hide'}`}>
        <MessageBox 
          type="info"
          message="Please let us know about your career so other members can track your accomplishments in your field."
          dismissable={true} />
        <div className="inline fields">
          <label>Are you employed as a software developer?</label>
          <RadioButton 
            label='Yes'
            name="working"
            onChange={handleInputChange} />
          <RadioButton 
            label='No'
            name="working"
            onChange={handleInputChange} />
        </div>
        { isWorking === 'yes' && 
          <div>
            <div className="inline field">
              <label>For how long have you been a working software developer?</label>
              <Dropdown options={surveyOptions} onChange={handleTenureChange} placeholder="≤ 5 years"/>
            </div>
            <FormField 
              label="Where are you currently employed?"
              onChange={handleInputChange}
              name="company"
              placeholder="Enter Company"
              inputOptions="mini"
              value={company}
              errors={errors} />
          </div>
        }
        { isWorking === 'no' && 
          <div className="inline fields">
            <label>Are you currently looking for full-time employment as a software developer?</label>
            <RadioButton 
              label='Yes!'
              name="jobSearch"
              onChange={handleInputChange} />
            <RadioButton 
              label='Not quite ready'
              name="jobSearch"
              onChange={handleInputChange} />
            <RadioButton 
              label='I am a hobbyist'
              name="jobSearch"
              onChange={handleInputChange} />
          </div>
        }  
      </form>
    </div>
  );
}

export default Career;