import React from 'react';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import { Dropdown, Input, Button } from 'semantic-ui-react';

const StyledInput = styled(Input)`
  width: 500px;
  @media screen and (max-width: 580px) {
    width: 400px;
  }
  @media screen and (max-width: 480px) {
    width: 100%;
  }
`;

const StyledButton = styled(Button)`
  margin: 10px 0 !important;
`;

const ErrorLabel = ({ isMobile, error }) => (
  <div
    style={{ marginTop: 10 }}
    className={`ui ${!isMobile ? 'left pointing' : ''} red basic label`}>
    {error}
  </div>
);

const RepoInput = ({item, isLoading, handleChange, isMobile, repoHosts, handleDropdownChange, addItem, icon, error}) => {
  return (
    <div>
        <StyledInput
            value={item}
            loading={isLoading}
            labelPosition="left"
            onChange={handleChange}
            placeholder="Namespace / Repo"
            fluid={isMobile ? true : false}
            label={
                <Dropdown
                options={repoHosts}
                className="basic green"
                defaultValue="https://github.com/"
                onChange={handleDropdownChange}
                />
            }
            action={ !isMobile ?
                <Button
                className="basic green"
                onClick={addItem}
                icon={icon}
                content="Save"/> : null
            }
            />
        {
            isMobile ?
                <StyledButton
                    className="basic green"
                    onClick={addItem}
                    icon={icon}
                    content="Save"/>
                : null
        }
        {
            !isEmpty(error) && !error.repo && !error.namespace &&
            <ErrorLabel isMobile={isMobile} error={error.header} />
        }
    </div>
  );
};
export default RepoInput
