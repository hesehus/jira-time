import { connect } from 'react-redux';

import Record from '../components/Records';

const mapStateToProps = ({ profile }) => {
    return {
        profile
    };
};

export default connect(mapStateToProps)(Record);
