import Users from 'components/users/users';

import People from 'components/people/people';

import Groups from 'components/groups/groups';

import PersonGroups from 'components/person_groups/person_groups';

import Funds from 'components/funds/funds';

import GroupCategories from 'components/group_categories/group_categories';

import PersonFunds from 'components/person_funds/person_funds';

import EventCategories from 'components/event_categories/event_categories';

import Events from 'components/events/events';

import PersonEvents from 'components/person_events/person_events';

import Roles from 'components/roles/roles';

import ConsultationCategories from 'components/consultation_categories/consultation_categories';

import PersonConsultations from 'components/person_consultations/person_consultations';

import Consultations from 'components/consultations/consultations';

import ScantronAppointments from 'components/scantron_appointments/scantron_appointments';

import PersonScantronAppointments from 'components/person_scantron_appointments/person_scantron_appointments';

import WebpackerReact from 'webpacker-react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import 'components/application.css'


WebpackerReact.setup({Users});
WebpackerReact.setup({People});
WebpackerReact.setup({Groups});
WebpackerReact.setup({PersonGroups});
WebpackerReact.setup({Funds});
WebpackerReact.setup({GroupCategories});
WebpackerReact.setup({PersonFunds});
WebpackerReact.setup({EventCategories});
WebpackerReact.setup({Events});
WebpackerReact.setup({PersonEvents});
WebpackerReact.setup({Roles});
WebpackerReact.setup({ConsultationCategories});
WebpackerReact.setup({PersonConsultations});
WebpackerReact.setup({Consultations});
WebpackerReact.setup({ScantronAppointments});
WebpackerReact.setup({PersonScantronAppointments});