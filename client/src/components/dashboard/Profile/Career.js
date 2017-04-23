import React from 'react';
import { Container } from './RepoList';
import styled from 'styled-components';
import Ribbon from './common/RibbonHeader';
import { Dropdown } from 'semantic-ui-react';
import FormField from '../../common/FormField';
import MessageBox from '../../common/MessageBox';
import RadioButton from '../../common/RadioButton';
import { mapScreenSizeToProps } from '../../Navbar';
import { connectScreenSize } from 'react-screen-size';
import { isEqual } from 'lodash';

import { surveyOptions } from '../../../assets/data/dropdownOptions';

const Error = styled.div`
  margin-bottom: 10px !important;
  cursor: pointer;Error
`;

const Button = styled.div`
  margin-top: -10px !important;
  margin-bottom: 45px !important;
`;

class Career extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }
  render() {
    const {
      errors,
      toggle,
      tenure,
      working,
      company,
      jobSearch,
      showPopUp,
      clearForm,
      showCareer,
      subSaveClick,
      handleInputChange,
      handleRadioChange,
      handleTenureChange,
      screen: { isMobile },
    } = this.props;
    return (
      <div>
        <Ribbon
          content="Career"
          id="careerPopUp"
          showSave={showCareer}
          showPopUp={showPopUp}
          subSaveClick={subSaveClick}
          onClick={()=>{toggle('showCareer')}} />
        <div className={`careerPane ui six wide form ${showCareer ? 'show' : 'hide'}`}>
          <MessageBox
            type="info"
            hide={working ? true : false}
            dismissable={true}
            message="Please let us know about your career so other members can track your accomplishments in your field." />
          { errors.career &&
            <Error className="ui red basic label">
              {errors.career}
            </Error> }
          <Container>
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
                  value={tenure}
                  placeholder="≤ 1 year"
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
              <Button onClick={clearForm} className="ui tiny green basic button">Clear Form</Button>
            </div>
            <div className={`surveyPaneWorking ${working === 'no' ? 'show' : 'hide'}`}>
              <div className={`${isMobile ? 'grouped' : 'inline'} fields`}>
                <label>Are you currently looking for full-time employment as a software developer?</label>
                <RadioButton
                  label='Yes!'
                  name="jobSearch"
                  onChange={handleRadioChange}
                  checked={jobSearch === 'Yes!' && true} />
                <RadioButton
                  name="jobSearch"
                  label="No, I'm not quite ready"
                  onChange={handleRadioChange}
                  checked={jobSearch === "No, I'm not quite ready" && true} />
                <RadioButton
                  name="jobSearch"
                  label='No, I am a hobbyist'
                  onChange={handleRadioChange}
                  checked={jobSearch === 'No, I am a hobbyist' && true} />
              </div>
              <div className="inline field">
                <label>For how long have you been coding / learning to code?</label>
                <Dropdown
                  placeholder="≤ 1 year"
                  options={surveyOptions}
                  value={tenure}
                  onChange={handleTenureChange} />
              </div>
              <Button onClick={clearForm} className="ui tiny green basic button">Clear Form</Button>
            </div>
          </Container>
        </div>
      </div>
    );
  }
}

export default connectScreenSize(mapScreenSizeToProps)(Career);
