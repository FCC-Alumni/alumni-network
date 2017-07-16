import { connectScreenSize } from 'react-screen-size';
import { Container } from './common/RepoContainer';
import { countries } from '../../../../assets/dropdowns/countries';
import { Dropdown } from 'semantic-ui-react';
import FormField from './common/FormField';
import { isEqual } from 'lodash';
import ListItem from '../../common/ListItem';
import { mapScreenSizeToProps } from '../../../Navbar';
import React from 'react';
import Ribbon from './common/RibbonHeader';
import { TransitionContainer } from '../../../../styles/style-utils';

const INPUT_OPTIONS = 'small left icon';
const INFO_MESSAGE = `The FCCAN team may or may not send you emails in the
                      future (nothing for now). If so, we will give you
                      the option to opt-in to any email-related
                      features or regular newsletters.`;

class PersonalInfo extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }
  render() {
    const {
      bio,
      country,
      displayName,
      email,
      errors,
      handleCountryChange,
      handleInputChange,
      isPrivate,
      location,
      saveSection,
      screen: { isMobile, isTablet },
      showPopUp,
      showProfile,
      toggle,
      toggleEmailVisibilty,
    } = this.props;
    return (
      <div>
        <Ribbon
          content="Personal Info"
          id="personalPopUp"
          onClick={() => toggle('showProfile')}
          saveSection={saveSection}
          showPopUp={showPopUp}
          showSave={showProfile} />
        <TransitionContainer className="ui form" isExpanded={showProfile}>
          <Container className="ui list">
            <ListItem>
              <FormField
                errors={errors}
                icon='user icon'
                inputOptions={INPUT_OPTIONS}
                name="displayName"
                onChange={handleInputChange}
                placeholder="Enter Display Name"
                tooltip="Display Name"
                value={displayName} />
            </ListItem>
            <ListItem>
              <FormField
                errors={errors}
                icon="mail icon"
                infoMessage={INFO_MESSAGE}
                inputOptions={INPUT_OPTIONS}
                isEmail={!errors.email && true}
                isPrivate={isPrivate}
                name="email"
                onChange={handleInputChange}
                placeholder="Enter Email"
                toggleEmailVisibilty={toggleEmailVisibilty}
                tooltip="Email"
                type="email"
                value={email} />
            </ListItem>
            <ListItem>
              <FormField
                errors={errors}
                icon="marker icon"
                inputOptions={INPUT_OPTIONS}
                name="location"
                onChange={handleInputChange}
                placeholder="Enter Location"
                tooltip="Location"
                value={location} />
            </ListItem>
            <ListItem>
              <div className="six wide field">
                <Dropdown
                  onChange={handleCountryChange}
                  options={countries}
                  placeholder='Select Country'
                  search
                  selection
                  value={country} />
                { errors.country &&
                <div
                  className={'ui red basic label'}
                  style={{ marginTop: 5 }}>
                  {errors.country}
                </div> }
              </div>
            </ListItem>
            <ListItem>
              <div className={`${isMobile
                  ? 'fluid' 
                  : isTablet
                  ? 'eight wide'
                  : 'six wide' } field`}>
                <textarea
                  name='bio'
                  onChange={handleInputChange}
                  placeholder="Enter a short bio here"
                  rows="3"
                  value={bio} />
              </div>
              { errors.bio &&
                <div className="ui red basic label">
                  {errors.bio}
                </div> }
            </ListItem>
          </Container>
        </TransitionContainer>
      </div>
    );
  }
}

export default connectScreenSize(mapScreenSizeToProps)(PersonalInfo);
