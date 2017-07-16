import { connectScreenSize } from 'react-screen-size';
import { Dropdown } from 'semantic-ui-react';
import FormField from './common/FormField';
import { Container as InnerContainer } from './common/RepoContainer';
import { isEqual } from 'lodash';
import { mapScreenSizeToProps } from '../../../Navbar';
import MessageBox from '../../common/MessageBox';
import RadioButton from './common/RadioButton';
import React from 'react';
import Ribbon from './common/RibbonHeader';
import styled from 'styled-components';
import surveyOptions from '../../../../assets/dropdowns/devSurvey';
import { TransitionContainer } from '../../../../styles/style-utils';

const Error = styled.div`
  margin-top: 10px !important;
`;

const OuterTransitionContainer = styled(TransitionContainer)`
  ${ props => props.bigBottomMargin &&
    'margin-bottom: 60px !important' }`;

const ClearButton = ({ onClick }) => (
  <div
    className="ui tiny green basic button"
    onClick={onClick}
    style={{ marginTop: -10 }}>
    {'Clear Form'}
  </div>
);

class Career extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }
  render() {
    const {
      bigBottomMargin,
      clearForm,
      company,
      errors,
      handleInputChange,
      handleRadioChange,
      handleTenureChange,
      hasBeenEmployed,
      jobSearch,
      saveSection,
      screen: { isMobile },
      showCareer,
      showPopUp,
      tenure,
      toggle,
      working,
    } = this.props;
    return (
      <div>
        <Ribbon
          content="Career"
          id="careerPopUp"
          onClick={() => toggle('showCareer')}
          saveSection={saveSection}
          showPopUp={showPopUp}
          showSave={showCareer} />
        <OuterTransitionContainer
          bigBottomMargin={bigBottomMargin}
          className="ui six wide form"
          isExpanded={showCareer}>
          <MessageBox
            dismissable={true}
            hide={working ? true : false}
            message="Please tell us about your career so
            other members can track your accomplishments!"
            type="info" />
          { errors.career &&
            <Error className="ui red basic label">
              {errors.career}
            </Error> }
          <InnerContainer>
            <div className="inline fields">
              <label>{'Are you employed as a software developer?'}</label>
              <RadioButton
                checked={working === 'yes' && true}
                label='Yes'
                name="isEmployed"
                onChange={handleRadioChange} />
              <RadioButton
                checked={working === 'no' && true}
                label='No'
                name="isEmployed"
                onChange={handleRadioChange} />
            </div>
            <TransitionContainer isExpanded={working === 'yes'}>
              <div className="inline field">
                <label>
                  {'For how long have you been a working software developer?'}
                </label>
                <Dropdown
                  onChange={handleTenureChange}
                  options={surveyOptions}
                  placeholder="≤ 1 year"
                  value={tenure} />
              </div>
              <FormField
                errors={errors}
                inputOptions="small"
                label="Enter companies seperated by a comma (max: 3)"
                name="company"
                onChange={handleInputChange}
                placeholder="Facebook, Google"
                value={company} />
              <ClearButton onClick={clearForm} />
            </TransitionContainer>
            <TransitionContainer isExpanded={working === 'no'}>
              <div className='inline fields'>
                <label>
                  {'Have you ever been employed as a software developer?'}
                </label>
                <RadioButton
                  checked={hasBeenEmployed === 'yes'}
                  label='Yes'
                  name="hasBeenEmployed"
                  onChange={handleRadioChange} />
                <RadioButton
                  checked={hasBeenEmployed === 'no'}
                  label="No"
                  name="hasBeenEmployed"
                  onChange={handleRadioChange} />
              </div>
              {hasBeenEmployed === 'yes' &&
                <FormField
                  errors={errors}
                  inputOptions="small"
                  label="Enter companies seperated by a comma (max: 3)"
                  name="company"
                  onChange={handleInputChange}
                  placeholder="Facebook, Google"
                  value={company} />
              }
              <div className={`${isMobile ? 'grouped' : 'inline'} fields`}>
                <label>
                  {`Are you currently looking for full-time
                  employment as a software developer?`}
                </label>
                <RadioButton
                  checked={jobSearch === 'Yes!' && true}
                  label='Yes!'
                  name="jobSearch"
                  onChange={handleRadioChange} />
                <RadioButton
                  checked={jobSearch === "No, I'm not quite ready" && true}
                  label="No, I'm not quite ready"
                  name="jobSearch"
                  onChange={handleRadioChange} />
                <RadioButton
                  checked={jobSearch === 'No, I am a hobbyist' && true}
                  label='No, I am a hobbyist'
                  name="jobSearch"
                  onChange={handleRadioChange} />
              </div>
              <div className="inline field">
                <label>
                  {'For how long have you been coding / learning to code?'}
                </label>
                <Dropdown
                  onChange={handleTenureChange}
                  options={surveyOptions}
                  placeholder="≤ 1 year"
                  value={tenure} />
              </div>
              <ClearButton onClick={clearForm} />
            </TransitionContainer>
          </InnerContainer>
        </OuterTransitionContainer>
      </div>
    );
  }
}

export default connectScreenSize(mapScreenSizeToProps)(Career);
