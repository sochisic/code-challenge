import React from 'react'
import Downshift from 'downshift';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import Item from './Item';
import { SEARCH_USERS } from '../dal/gql-queries';

function Main({ history }) {
  return (
    <Downshift
      defaultHighlightedIndex={0}
      onChange={selectedItem => {
        history.push(selectedItem, {})
      }}>
      {({
        inputValue,
        getInputProps,
        getMenuProps,
        getItemProps,
        selectedItem,
        highlightedIndex,
        isOpen,
      }) => (
          <div className='main-container'>
            <h3>Code-challenge</h3>
            <span>Let's try to find you on Github</span>
            <div>
              <input className={`main-input ${isOpen ? 'opened' : ''}`} placeholder='Start to enter name' {...getInputProps()} />
              <ul className={`main-menu ${isOpen ? 'opened' : ''}`} {...getMenuProps()}>
                {isOpen && (
                  <Query query={SEARCH_USERS} variables={{ inputValue }}>
                    {({ loading, error, data: { search = {} } = {} }) => {
                      if (loading) return <li className='error'>Loading...</li>;
                      if (error) return `Error! ${error.message}`;

                      const filteredOnlyLogin = search.edges.length > 0 ? search.edges.filter(it => {
                        const loginMatches = it.textMatches.find(match => match.property === 'login');
                        return loginMatches && loginMatches.length !== 0;
                      }) : [];

                      const getLoginsArr = filteredOnlyLogin.map(it => {
                        const loginMatch = it.textMatches.find(match => match.property === 'login');
                        return loginMatch.fragment;
                      })

                      return getLoginsArr.map((item, index) => <Item
                        key={item}
                        user={item}
                        getItemProps={getItemProps({ item })}
                        {...getItemProps({
                          item,
                          index,
                          isActive: highlightedIndex === index,
                          isSelected: selectedItem === item,
                        })}
                      />)
                    }}
                  </Query>
                )}
              </ul>
            </div>
          </div>
        )}
    </Downshift>
  )
}

Main.propTypes = {

};

export default Main;

