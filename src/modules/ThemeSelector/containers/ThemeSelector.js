import { connect } from 'react-redux';

import ThemeSelector from '../components/ThemeSelector';

import { setTheme } from 'store/reducers/profile';

const mapStateToProps = (state) => ({
    profile: state.profile
});

const mapDispatchToProps = {
    setTheme
};

export default connect(mapStateToProps, mapDispatchToProps)(ThemeSelector);
