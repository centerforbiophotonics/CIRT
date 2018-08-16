import Users from 'components/users/users';

import People from 'components/people/people';

import Groups from 'components/groups/groups';

import PersonGroups from 'components/person_groups/person_groups';

import WebpackerReact from 'webpacker-react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import 'components/application.css'


WebpackerReact.setup({Users});
WebpackerReact.setup({People});
WebpackerReact.setup({Groups});
WebpackerReact.setup({PersonGroups});