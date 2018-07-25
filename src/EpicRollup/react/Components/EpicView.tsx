import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
//import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import * as React from 'react';
import { connect, Provider } from 'react-redux';
import { UIStatus } from '../../../Common/Contracts/types';
import { getProjectId, getTeamId } from '../../../Common/Selectors/CommonSelectors';
import { IEpicRollupState } from '../../redux/contracts';
import configureEpicRollupStore from '../../redux/epicRollupStore';
import { epicRollupGridViewSelector, IEpicRollupGridView } from '../../redux/selectors/epicRollupGridViewSelector';
import { uiStateSelector } from '../../redux/selectors/uiStateSelector';
import { EpicContent } from './EpicContent';
import { EpicSelector } from './EpicSelector';
import './EpicView.scss';

initializeIcons(/* optional base url */);

export interface IEpicRollupViewProps {
    projectId: string;
    teamId: string;
    uiState: UIStatus;
    gridView: IEpicRollupGridView
}


class EpicRollupViewContent extends React.Component<IEpicRollupViewProps, {}> {
    constructor() {
        super();
    }

    public render(): JSX.Element {
        const {
            uiState,
        } = this.props;

        if (uiState === UIStatus.Loading) {
            return (
                <Spinner size={SpinnerSize.large} label="Loading..." />
            );
        }

        //needs to move to EpicContent
        if (uiState === UIStatus.NoTeamIterations) {
            return (
                <MessageBar
                    messageBarType={MessageBarType.error}
                    isMultiline={false}
                >
                    {"The team does not have any iteration selected, please visit team admin page and select team iterations."}
                </MessageBar>
            );
        }

        if (uiState === UIStatus.NoWorkItems) {
            return (<MessageBar
                messageBarType={MessageBarType.info}
                isMultiline={false}
            >
                {"No in-progress Features for the timeline."}
            </MessageBar>);
        }
        return (
            <div className="epic-container">
                <EpicSelector
                    projectId={this.props.projectId}
                    teamId={this.props.teamId} />
                <EpicContent
                    projectId={this.props.projectId}
                    teamId={this.props.teamId}
                    gridView={this.props.gridView} />
            </div>
        );
    }
}


const makeMapStateToProps = () => {
    return (state: IEpicRollupState) => {
        return {
            projectId: getProjectId(),
            teamId: getTeamId(),
            uiState: uiStateSelector(state),
            gridView: epicRollupGridViewSelector(state)
        }
    }
}

export const ConnectedEpicRollupViewContent = connect(makeMapStateToProps)(EpicRollupViewContent);

export const EpicRollupView = () => {
    const initialState: IEpicRollupState = {
    } as IEpicRollupState;
    const store = configureEpicRollupStore(initialState);

    // const projectId = getProjectId();
    // const teamId = getTeamId();

    return (
        <Provider store={store}>
            <ConnectedEpicRollupViewContent />
        </Provider>);
}


