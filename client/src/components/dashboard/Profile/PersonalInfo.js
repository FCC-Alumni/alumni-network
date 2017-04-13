import React from 'react';
import Ribbon from './common/RibbonHeader';
import { Dropdown } from 'semantic-ui-react';
import ListItem from '../../common/ListItem';
import FormField from '../../common/FormField';
import { countryOptions } from '../../../assets/data/countries';

const inputOptions = 'small left icon';

const PersonalInfo = ({
  bio,
  email,
  errors,
  toggle,
  country,
  username,
  location,
  showPopUp,
  profileUrl,
  displayName,
  showProfile,
  subSaveClick,
  handleInputChange,
  handleCountryChange,
}) => {
  return (
    <div>
      <Ribbon
        id="personalPopUp"
        content="Personal Info"
        showPopUp={showPopUp}
        showSave={showProfile}
        subSaveClick={subSaveClick}
        wrapperClass="profileWrapper"
        onClick={()=>{toggle('showProfile')}} />
      <form className={`ui form profilePane ${showProfile ? 'show' : 'hide'}`}>
        <div className="ui list">
          <ListItem icon="spy icon">
            {username}
          </ListItem>
          <ListItem icon="github icon">
            <a href={profileUrl} target="_blank">GitHub Profile</a>
          </ListItem>
          <ListItem>
            <FormField
              errors={errors}
              icon='user icon'
              name="displayName"
              value={displayName}
              tooltip="Display Name"
              inputOptions={inputOptions}
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
              inputOptions={inputOptions}
              placeholder="Enter Email"
              onChange={handleInputChange} />
          </ListItem>
          <ListItem>
            <FormField
              errors={errors}
              value={location}
              name="location"
              tooltip="Location"
              icon="marker icon"
              inputOptions={inputOptions}
              onChange={handleInputChange}
              placeholder="Enter City / State" />
          </ListItem>
          <ListItem>
            <div className="six wide field">
              <Dropdown
                search
                selection
                value={country}
                options={countryOptions}
                placeholder='Select Country'
                onChange={handleCountryChange} />
            </div>
          </ListItem>
          <ListItem>
            <div className="six wide field">
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
        </div>
      </form>
    </div>
  );
}

export default PersonalInfo;
