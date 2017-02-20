import React, { PropTypes } from 'react';
import Loader from 'react-loader';
import { translate } from 'react-i18next';
import { Panel, Form } from 'react-bootstrap';
import { grep, translatableConf, save } from '../api';
import { diffObjects, cloneObject, promisifyData, cancelPromises } from '../utils';
import FieldGroup from './utils/FieldGroup';
import SelectGroup from './utils/SelectGroup';
import SwitchGroup from './utils/SwitchGroup';
import FormActions from './utils/FormActions';

class Controllers extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.initialValues = {};
    this.currentValues = {};
    this.state = {
      isLoaded: false,
      isSaving: false,
    };
  }

  async componentWillMount() {
    const state = await promisifyData(
      translatableConf(['recalbox.controllers.ps3drivers']),
      grep([
        'controllers.db9.enabled',
        'controllers.db9.args',
        'controllers.gamecon.enabled',
        'controllers.gamecon.args',
        'controllers.gpio.enabled',
        'controllers.gpio.args',
        'controllers.ps3.enabled',
        'controllers.ps3.driver',
      ])
    );

    this.initialValues = state;
    state.isLoaded = true;

    this.setState(state);
  }

  componentWillUnmount() {
    cancelPromises();
  }

  handleSwitchChange = (elm, newState) => {
    this.handleInputChange({
      target: {
        name: elm.props.name,
        type: 'input',
        value: newState ? 1 : 0,
      }
    });
  }

  handleInputChange = (e) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.currentValues[name] = value;
    this.setState({ [name]: value });
  }

  onSubmit = (e) => {
    e.preventDefault();

    let diff = diffObjects(this.initialValues, this.currentValues);

    if (0 < Object.keys(diff).length) {
      this.setState({ isSaving: true });

      save(diff).then(() => {
        this.initialValues = cloneObject(this.currentValues);

        this.setState({ isSaving: false });
      });
    }
  }

  reset = (e) => {
    e.preventDefault();

    this.currentValues = cloneObject(this.initialValues);

    this.setState(this.currentValues);
  }

  render() {
    const { t } = this.props;

    return (
      <div>
        <div className="page-header"><h1>{t('Contrôleurs')}</h1></div>

        <p className="important">{t('Cette page permet de gérer les différents contrôleurs supportés par de recalbox.')}</p>

        <Loader loaded={this.state.isLoaded}>
          <Form horizontal onSubmit={this.onSubmit}>
            <Panel header={<h3>{t('Contrôleur DB9')}</h3>}>
              <SwitchGroup label={t('Support des contrôleurs DB9')}
                id="db9-enabled" name="controllers.db9.enabled"
                value={this.state['controllers.db9.enabled']}
                onChange={this.handleSwitchChange}
              />

              <FieldGroup type="text" label={t('Paramètres')}
                id="db9-args" name="controllers.db9.args"
                value={this.state['controllers.db9.args']}
                onChange={this.handleInputChange}
              />
            </Panel>

            <Panel header={<h3>{t('Contrôleur Gamecon')}</h3>}>
              <SwitchGroup label={t('Support des contrôleurs Gamecon')}
                id="gamecon-enabled" name="controllers.gamecon.enabled"
                value={this.state['controllers.gamecon.enabled']}
                onChange={this.handleSwitchChange}
              />

              <FieldGroup type="text" label={t('Paramètres')}
                id="gamecon-args" name="controllers.gamecon.args"
                value={this.state['controllers.gamecon.args']}
                onChange={this.handleInputChange}
              />
            </Panel>

            <Panel header={<h3>{t('Contrôleur GPIO')}</h3>}>
              <SwitchGroup label={t('Support des contrôleurs GPIO')}
                id="gpio-enabled" name="controllers.gpio.enabled"
                value={this.state['controllers.gpio.enabled']}
                onChange={this.handleSwitchChange}
              />

              <FieldGroup type="text" label={t('Paramètres')}
                id="gpio-args" name="controllers.gpio.args"
                value={this.state['controllers.gpio.args']}
                onChange={this.handleInputChange}
              />
            </Panel>

            <Panel header={<h3>{t('Contrôleur PS3')}</h3>}>
              <SwitchGroup label={t('Support des contrôleurs PS3')}
                id="ps3-enabled" name="controllers.ps3.enabled"
                value={this.state['controllers.ps3.enabled']}
                onChange={this.handleSwitchChange}
              />

              <SelectGroup label={t('Driver à utiliser')}
                id="ps3-driver" name="controllers.ps3.driver"
                data={this.state['recalbox.controllers.ps3drivers']}
                defaultValue={this.state['controllers.ps3.driver']}
                onChange={this.handleInputChange}
              />
            </Panel>

            <FormActions reset={this.reset} isSaving={this.state.isSaving} />
          </Form>
        </Loader>
      </div>
    );
  }
}

export default translate()(Controllers);
