import React, { Component } from 'react'
import { Typography,ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Link } from 'react-router-dom';

export default class MenuItemLink extends Component {
    renderLink = itemProps => <Link to={this.props.to} {...itemProps} />;

    render() {
      const { icon, primary } = this.props;
      if((this.props.roles.includes(this.props.userRole))){
        return (
          <li>
            <ListItem button component={this.renderLink}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={<Typography type="body2" style={{ color: '#FFFFFF' }}>{primary}</Typography>}/>
            </ListItem>
          </li>
        )
      }else{
        return null
      }

    }
}
