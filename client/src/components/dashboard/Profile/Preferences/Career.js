import React from 'react';
import { isEqual } from 'lodash';
import styled from 'styled-components';
import FormField from './common/FormField';
import Ribbon from './common/RibbonHeader';
import { Dropdown } from 'semantic-ui-react';
import RadioButton from './common/RadioButton';
import MessageBox from '../../common/MessageBox';
import { connectScreenSize } from 'react-screen-size';
import { mapScreenSizeToProps } from '../../../Navbar';
import { Container as InnerContainer } from './common/RepoContainer';
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
    style={{ marginTop: -10 }}
    onClick={onClick}
    className="ui tiny green basic button">
    Clear Form
  </div>
);

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
      saveSection,
      bigBottomMargin,
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
          saveSection={saveSection}
          onClick={() => toggle('showCareer')} />
        <OuterTransitionContainer
          isExpanded={showCareer}
          className="ui six wide form"
          bigBottomMargin={bigBottomMargin}>
          <MessageBox
            type="info"
            hide={working ? true : false}
            dismissable={true}
            message="Please tell us about your career so other members can track your accomplishments!" />
          { errors.career &&
            <Error className="ui red basic label">
              {errors.career}
            </Error> }
          <InnerContainer>
            <div className="inline fields">
              <label>Are you employed as a software developer?</label>
              <RadioButton
                label='Yes'
                name="isEmployed"
                onChange={handleRadioChange}
                checked={working === 'yes' && true} />
              <RadioButton
                label='No'
                name="isEmployed"
                onChange={handleRadioChange}
                checked={working === 'no' && true}  />
            </div>
            <TransitionContainer isExpanded={working === 'yes'}>
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
              <ClearButton onClick={clearForm} />
            </TransitionContainer>
            <TransitionContainer isExpanded={working === 'no'}>
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
              <ClearButton onClick={clearForm} />
            </TransitionContainer>
          </InnerContainer>
        </OuterTransitionContainer>
      </div>
    );
  }
}

export default connectScreenSize(mapScreenSizeToProps)(Career);
