import React from 'react';
import { isEqual } from 'lodash';
import FormField from './common/FormField';
import Ribbon from './common/RibbonHeader';
import { Dropdown } from 'semantic-ui-react';
import ListItem from '../../common/ListItem';
import { Container } from './common/RepoList';
import { connectScreenSize } from 'react-screen-size';
import { mapScreenSizeToProps } from '../../../Navbar';
import { countries } from '../../../../assets/dropdowns/countries';
import { TransitionContainer } from '../../../../styles/globalStyles';

const INPUT_OPTIONS = 'small left icon';
const INFO_MESSAGE = `Don't worry, no junkmail. We are asking for your email in order to
                      help you and your fellow community members stay better connected.
                      If you decide to share your email address, please be aware that it
                      will be publicly visible on your profile page.`;

class PersonalInfo extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }
  render() {
    const {
      bio,
      email,
      errors,
      toggle,
      country,
      location,
      showPopUp,
      displayName,
      showProfile,
      subSaveClick,
      handleInputChange,
      screen: { isMobile, isTablet },
      handleCountryChange,
    } = this.props;
    return (
      <div>
        <Ribbon
          id="personalPopUp"
          content="Personal Info"
          showPopUp={showPopUp}
          showSave={showProfile}
          subSaveClick={subSaveClick}
          onClick={() => toggle('showProfile')} />
        <TransitionContainer isExpanded={showProfile} className="ui form">
          <Container className="ui list">
            <ListItem>
              <FormField
                errors={errors}
                icon='user icon'
                name="displayName"
                value={displayName}
                tooltip="Display Name"
                inputOptions={INPUT_OPTIONS}
                onChange={handleInputChange}
                placeholder="Enter Display Name" />
            </ListItem>
            <ListItem>
              <FormField
                type="email"
                name="email"
                value={email}
                tooltip="Email"
                errors={errors}
                icon="mail icon"
                placeholder="Enter Email"
                infoMessage={INFO_MESSAGE}
                inputOptions={INPUT_OPTIONS}
                info={!errors.email && true}
                onChange={handleInputChange} />
            </ListItem>
            <ListItem>
              <FormField
                errors={errors}
                value={location}
                name="location"
                tooltip="Location"
                icon="marker icon"
                inputOptions={INPUT_OPTIONS}
                onChange={handleInputChange}
                placeholder="Enter Location" />
            </ListItem>
            <ListItem>
              <div className="six wide field">
                <Dropdown
                  search
                  selection
                  value={country}
                  options={countries}
                  placeholder='Select Country'
                  onChange={handleCountryChange} />
              </div>
            </ListItem>
            <ListItem>
              <div className={`${isMobile ? 'fluid' : isTablet ? 'eight wide' : 'six wide' } field`}>
                <textarea
                  rows="3"
                  name='bio'
                  value={bio}
                  onChange={handleInputChange}
                  placeholder="Enter a short bio here" />
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
