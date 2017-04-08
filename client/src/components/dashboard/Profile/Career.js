import React from 'react';
import Ribbon from './common/RibbonHeader';
import { Dropdown } from 'semantic-ui-react';
import FormField from '../../common/FormField';
import MessageBox from '../../common/MessageBox';
import RadioButton from '../../common/RadioButton';

import { surveyOptions } from '../../../assets/data/dropdownOptions';

const Career = ({
  errors,
  toggle,
  tenure,
  working,
  company,
  jobSearch,
  showPopUp,
  showCareer,
  subSaveClick,
  handleInputChange,
  handleRadioChange,
  handleTenureChange
}) => {
  return (
    <div>
      <Ribbon
        content="Career"
        id="careerPopUp"
        showSave={showCareer}
        showPopUp={showPopUp}
        subSaveClick={subSaveClick}
        wrapperClass="careerWrapper"
        onClick={()=>{toggle('showCareer')}} />
      <div className={`careerPane ui six wide form ${showCareer ? 'show' : 'hide'}`}>
        <MessageBox
          type="info"
          dismissable={true}
          message="Please let us know about your career so other members can track your accomplishments in your field." />
        <div className="inline fields">
          <label>Are you employed as a software developer?</label>
          <RadioButton
            label='Yes'
            name="working"
            onChange={handleRadioChange}
            checked={working === 'yes' && true} />
          <RadioButton
            label='No'
            name="working"
            onChange={handleRadioChange}
            checked={working === 'no' && true}  />
        </div>
        <div className={`surveyPaneWorking ${working === 'yes' ? 'show' : 'hide'}`}>
          <div className="inline field">
            <label>For how long have you been a working software developer?</label>
            <Dropdown
              defaultValue={tenure}
              placeholder="≤ 5 years"
              options={surveyOptions}
              onChange={handleTenureChange} />
          </div>
          <FormField
            name="company"
            errors={errors}
            value={company}
            inputOptions="small"
            placeholder="Enter Company"
            onChange={handleInputChange}
            label="Where are you currently employed?" />
        </div>
        <div className={`surveyPaneWorking ${working === 'no' ? 'show' : 'hide'}`}>
          <div className="inline fields">
            <label>Are you currently looking for full-time employment as a software developer?</label>
            <RadioButton
              label='Yes!'
              name="jobSearch"
              onChange={handleRadioChange}
              checked={jobSearch === 'Yes!' && true} />
            <RadioButton
              name="jobSearch"
              label='Not quite ready'
              onChange={handleRadioChange}
              checked={jobSearch === 'Not quite ready' && true} />
            <RadioButton
              name="jobSearch"
              label='I am a hobbyist'
              onChange={handleRadioChange}
              checked={jobSearch === 'I am a hobbyist' && true} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Career;
