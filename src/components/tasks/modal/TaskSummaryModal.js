import React from 'react';
import Lottie from 'react-lottie';

import ConditionalRender from '../../hoc/ConditionalRender';
import animData from './../../../assets/anims/task-settings';
import { floatToHR } from './../../../utils/time';
import isObjectEmpty from './../../../utils/isObjectEmpty';

const defaultOptions = {
  loop: false,
  autoplay: true,
  animationData: animData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

export default class TaskSummaryModal extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * [_handleCancel funcs. closes modal]
   */
  _handleCancel = () => this.props.closeModal('taskSummaryModal');

  _handleApply = () => this.props._handleStartTaskButton();

  render() {
    const {
      bid,
      compute_on,
      concent,
      estimated_cost,
      format,
      frames,
      isMainNet,
      loadingTaskIndicator,
      minPerf,
      resolution,
      samples,
      status,
      subtasks_count,
      subtask_timeout,
      timeout,
      data
    } = this.props;
    const { diff, obsoletePrice } = data;
    return (
      <div className="container__modal task-summary-modal__container">
        <div className="content__modal task-summary-modal__content">
          <div className="task-summary-modal__section-image">
            <Lottie options={defaultOptions} />
          </div>
          <div className="summary__title">Confirm your task settings</div>
          {!isObjectEmpty(diff) && (
            <div className="summary__optimize">
              Golem has optimized your task
            </div>
          )}
          <div className="summary__list">
            <div className="summary__item">
              <span className="title">Resolution:</span>
              <span className="value">{`${resolution[0]}x${
                resolution[1]
              }`}</span>
            </div>
            <div className="summary__item">
              <span className="title">Frames:</span>
              <span className="value">{frames}</span>
            </div>
            <ConditionalRender showIf={samples > 0}>
              <div className="summary__item">
                <span className="title">Samples:</span>
                <span className="value">{samples}</span>
              </div>
            </ConditionalRender>
            <div className="summary__item">
              <span className="title">Format:</span>
              <span className="value">{format}</span>
            </div>
            <div className="summary__item">
              <span className="title">Task Timeout:</span>
              <span className="value">{floatToHR(timeout)}</span>
            </div>
            <div className="summary__item">
              <span className="title">Subtask Amount:</span>
              <span className="value">
                {!isObjectEmpty(diff) ? (
                  <span>
                    <strike className="params__obsolete">
                      {diff.subtasks_count}
                    </strike>
                    <span>{' | '}</span>
                    <span className="params__suggested">{subtasks_count}</span>
                  </span>
                ) : (
                  <span>{subtasks_count}</span>
                )}
              </span>
            </div>
            <div className="summary__item">
              <span className="title">Subtask Timeout:</span>
              <span className="value">{floatToHR(subtask_timeout)}</span>
            </div>
            <div className="summary__item">
              <span className="title">Render on:</span>
              <span className="value">{compute_on.toUpperCase()}</span>
            </div>
            <div className="summary__item">
              <span className="title">Using Concent:</span>
              <span className="value">{concent ? 'Yes' : 'No'}</span>
            </div>
            <div className="summary__item">
              <span className="title">Minimum provider score:</span>
              <span className="value">{minPerf * 100}</span>
            </div>
            <div className="summary__item">
              <span className="title">Task fee:</span>
              <span className="value">
                {!isObjectEmpty(diff) ? (
                  <span>
                    <strike className="params__obsolete">
                      {obsoletePrice.toFixed(3)}
                    </strike>
                    <span>{' | '}</span>
                    <span className="params__suggested">
                      {estimated_cost.GNT.toFixed(3)}
                    </span>
                  </span>
                ) : (
                  <span>{estimated_cost.GNT.toFixed(3)}</span>
                )}{' '}
                {isMainNet ? '' : 't'}GNT
              </span>
            </div>
            <div className="summary__item">
              <span className="title">Tx fee lock:</span>
              <span className="value">
                {estimated_cost.ETH.toFixed(4)} {isMainNet ? '' : 't'}ETH
              </span>
            </div>
            <ConditionalRender showIf={!!concent}>
              <div className="summary__item">
                <span className="title">Deposit fee:</span>
                <span className="value">
                  {estimated_cost.deposit.GNT_suggested.toFixed(4)}{' '}
                  {isMainNet ? '' : 't'}ETH
                </span>
              </div>
              <div className="summary__item">
                <span className="title">Deposit Tx fee:</span>
                <span className="value">
                  {estimated_cost.deposit.ETH.toFixed(4)} {isMainNet ? '' : 't'}
                  ETH
                </span>
              </div>
            </ConditionalRender>
          </div>
          <div className="task-summary-modal__action">
            <span className="btn--cancel" onClick={this._handleCancel}>
              Cancel
            </span>
            <button
              type="button"
              className="btn--primary"
              onClick={this._handleApply}
              disabled={loadingTaskIndicator}
              autoFocus>
              Start Task
            </button>
          </div>
        </div>
      </div>
    );
  }
}
