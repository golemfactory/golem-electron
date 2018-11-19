import * as actions from '../'

describe('actions', () => {
    it('should create an action to updateNodeName', () => {
        const payload = "New Node Name"
        const expectedAction = {
            payload: "New Node Name",
            type: actions.dict.UPDATE_NODE_NAME
        }
        expect(actions.updateNodeName(payload)).toEqual(expectedAction)
    })

    it('should create an action to setAllFrames', () => {
        const payload = true
        const expectedAction = {
            payload: payload,
            type: actions.dict.SET_ALL_FRAMES
        }
        expect(actions.setAllFrames(payload)).toEqual(expectedAction)
    })

    it('should create an action to setFramesWithSubTask', () => {
        const payload = true
        const expectedAction = {
            payload: payload,
            type: actions.dict.SET_FRAMES_WITH_SUBTASKS
        }
        expect(actions.setFramesWithSubTask(payload)).toEqual(expectedAction)
    })

    it('should create an action to setSubtasksBorder', () => {
        const payload = [[0,100],[100,10],[10,50],[50,0]]
        const expectedAction = {
            payload: payload,
            type: actions.dict.SET_FRAMES_WITH_SUBTASKS
        }
        expect(actions.setFramesWithSubTask(payload)).toEqual(expectedAction)
    })

    it('should create an action to setPreviews', () => {
        const payload = [1,2,3,4,5]
        const expectedAction = {
            payload: payload,
            type: actions.dict.SET_PREVIEW_LIST
        }
        expect(actions.setPreviews(payload)).toEqual(expectedAction)
    })

    it('should create an action to setSubtasksList', () => {
        const payload = [1,2,3,4,5]
        const expectedAction = {
            payload: payload,
            type: actions.dict.SET_SUBTASKS_LIST
        }
        expect(actions.setSubtasksList(payload)).toEqual(expectedAction)
    })

    it('should create an action to fetchSubtasksList', () => {
        const payload = [1,2,3,4,5]
        const expectedAction = {
            payload: payload,
            type: actions.dict.FETCH_SUBTASKS_LIST
        }
        expect(actions.fetchSubtasksList(payload)).toEqual(expectedAction)
    })

    it('should create an action to setSubtasksVisibility', () => {
        const payload = true
        const expectedAction = {
            payload: payload,
            type: actions.dict.SET_SUBTASKS_VISIBILITY
        }
        expect(actions.setSubtasksVisibility(payload)).toEqual(expectedAction)
    })

    it('should create an action to setFrameId', () => {
        const payload = 2
        const expectedAction = {
            payload: payload,
            type: actions.dict.SET_FRAME_ID
        }
        expect(actions.setFrameId(payload)).toEqual(expectedAction)
    })

    it('should create an action to setFrameIndex', () => {
        const payload = 2
        const expectedAction = {
            payload: payload,
            type: actions.dict.SET_FRAME_INDEX
        }
        expect(actions.setFrameIndex(payload)).toEqual(expectedAction)
    })

    it('should create an action to nextFrame', () => {
        const expectedAction = {
            type: actions.dict.SET_FRAME_INDEX
        }
        expect(actions.setFrameIndex()).toEqual(expectedAction)
    })

    it('should create an action to previousFrame', () => {
        const expectedAction = {
            type: actions.dict.PREVIOUS_FRAME
        }
        expect(actions.previousFrame()).toEqual(expectedAction)
    })

    it('should create an action to setTaskInfo', () => {
        const payload = {info:{}}
        const expectedAction = {
            payload: payload,
            type: actions.dict.SET_TASK_INFO
        }
        expect(actions.setTaskInfo(payload)).toEqual(expectedAction)
    })

    it('should create an action to setSystemInfo', () => {
        const payload = {info:{}}
        const expectedAction = {
            payload: payload,
            type: actions.dict.SET_SYSTEM_INFO
        }
        expect(actions.setSystemInfo(payload)).toEqual(expectedAction)
    })

    it('should create an action to createAdvancedPreset', () => {
        const payload = {present:{}}
        const expectedAction = {
            payload: payload,
            type: actions.dict.CREATE_ADVANCED_PRESET
        }
        expect(actions.createAdvancedPreset(payload)).toEqual(expectedAction)
    })

    it('should create an action to deleteAdvancedPreset', () => {
        const payload = {present:{}}
        const expectedAction = {
            payload: payload,
            type: actions.dict.DELETE_ADVANCED_PRESET
        }
        expect(actions.deleteAdvancedPreset(payload)).toEqual(expectedAction)
    })

    it('should create an action to setAdvancedChart', () => {
        const payload = {chart:{}}
        const expectedAction = {
            payload: payload,
            type: actions.dict.SET_ADVANCED_CHART
        }
        expect(actions.setAdvancedChart(payload)).toEqual(expectedAction)
    })

    it('should create an action to setChosenPreset', () => {
        const payload = {present:{}}
        const init = false
        const expectedAction = {
            payload: payload,
            init: init,
            type: actions.dict.SET_CHOSEN_HARDWARE_PRESET
        }
        expect(actions.setChosenPreset(payload, init)).toEqual(expectedAction)
    })

    it('should create an action to setAdvancedManually', () => {
        const payload = {advanced:{}}
        const expectedAction = {
            payload: payload,
            type: actions.dict.SET_ADVANCED_MANUALLY
        }
        expect(actions.setAdvancedManually(payload)).toEqual(expectedAction)
    })

    it('should create an action to setHistory', () => {
        const payload = [{id:3}]
        const expectedAction = {
            payload: payload,
            type: actions.dict.SET_HISTORY
        }
        expect(actions.setHistory(payload)).toEqual(expectedAction)
    })

    it('should create an action to setResources', () => {
        const payload = {cpu: 3, ram: 1024, disk: 1024}
        const expectedAction = {
            payload: payload,
            type: actions.dict.SET_RESOURCES
        }
        expect(actions.setResources(payload)).toEqual(expectedAction)
    })

    it('should create an action to setConnectedPeers', () => {
        const payload = {peers: 4}
        const expectedAction = {
            payload: payload,
            type: actions.dict.SET_CONNECTED_PEERS
        }
        expect(actions.setConnectedPeers(payload)).toEqual(expectedAction)
    })

    it('should create an action to setFileLocation', () => {
        const payload = {path: ""}
        const expectedAction = {
            payload: payload,
            type: actions.dict.SET_FILE_LOCATION
        }
        expect(actions.setFileLocation(payload)).toEqual(expectedAction)
    })

    it('should create an action to setPerformanceCharts', () => {
        const payload = {cpu: 1200, blender: 600, luxrender: 500}
        const expectedAction = {
            payload: payload,
            type: actions.dict.SET_PERFORMANCE_CHARTS
        }
        expect(actions.setPerformanceCharts(payload)).toEqual(expectedAction)
    })

    it('should create an action to setProviderMinPrice', () => {
        const payload = 500
        const init = false
        const expectedAction = {
            payload: payload,
            init: init,
            type: actions.dict.SET_PROV_MIN_PRICE
        }
        expect(actions.setProviderMinPrice(payload, init)).toEqual(expectedAction)
    })

    it('should create an action to setRequestorMaxPrice', () => {
        const payload = 500
        const init = false
        const expectedAction = {
            payload: payload,
            init: init,
            type: actions.dict.SET_REQ_MAX_PRICE
        }
        expect(actions.setRequestorMaxPrice(payload, init)).toEqual(expectedAction)
    })

    it('should create an action to setAvatar', () => {
        const payload = {url: ""}
        const expectedAction = {
            payload: payload,
            type: actions.dict.SET_AVATAR
        }
        expect(actions.setAvatar(payload)).toEqual(expectedAction)
    })

    it('should create an action to setNodeName', () => {
        const payload = {name: ""}
        const expectedAction = {
            payload: payload,
            type: actions.dict.SET_NODE_NAME
        }
        expect(actions.setNodeName(payload)).toEqual(expectedAction)
    })

    it('should create an action to setProviderTrust', () => {
        const payload = 500
        const init = false
        const expectedAction = {
            payload: (payload / 100),
            init: init,
            type: actions.dict.SET_PROV_TRUST
        }
        expect(actions.setProviderTrust(payload, init)).toEqual(expectedAction)
    })

    it('should create an action to setRequestorTrust', () => {
        const payload = 500
        const init = false
        const expectedAction = {
            payload: (payload / 100),
            init: init,
            type: actions.dict.SET_REQ_TRUST
        }
        expect(actions.setRequestorTrust(payload, init)).toEqual(expectedAction)
    })

    it('should create an action to setNetworkProviderTrust', () => {
        const payload = 500
        const expectedAction = {
            payload: payload,
            type: actions.dict.SET_NET_PROV_TRUST
        }
        expect(actions.setNetworkProviderTrust(payload)).toEqual(expectedAction)
    })

    it('should create an action to setNetworkRequestorTrust', () => {
        const payload = 500
        const expectedAction = {
            payload: payload,
            type: actions.dict.SET_NET_REQ_TRUST
        }
        expect(actions.setNetworkRequestorTrust(payload)).toEqual(expectedAction)
    })

    it('should create an action to setTaskStats', () => {
        const payload = []
        const expectedAction = {
            payload: payload,
            type: actions.dict.SET_TASK_STATS
        }
        expect(actions.setTaskStats(payload)).toEqual(expectedAction)
    })

    it('should create an action to setTaskDetails', () => {
        const payload = {}
        const expectedAction = {
            payload: payload,
            type: actions.dict.SET_TASK_DETAILS
        }
        expect(actions.setTaskDetails(payload)).toEqual(expectedAction)
    })

    it('should create an action to getTaskDetails', () => {
        const payload = {}
        const expectedAction = {
            payload: payload,
            type: actions.dict.GET_TASK_DETAILS
        }
        expect(actions.getTaskDetails(payload)).toEqual(expectedAction)
    })

    it('should create an action to setPreview', () => {
        const payload = true
        const expectedAction = {
            payload: payload,
            type: actions.dict.SET_PREVIEW
        }
        expect(actions.setPreview(payload)).toEqual(expectedAction)
    })

    it('should create an action to updatePreviewLock', () => {
        const payload = {
            id: 0,
            enabled: true,
            frameCount: 1
        }
        const expectedAction = {
            payload: payload,
            type: actions.dict.UPDATE_PREVIEW_LOCK
        }
        expect(actions.updatePreviewLock(payload)).toEqual(expectedAction)
    })

    it('should create an action to setOnboard', () => {
        const payload = true
        const expectedAction = {
            payload: payload,
            type: actions.dict.ONBOARDING
        }
        expect(actions.setOnboard(payload)).toEqual(expectedAction)
    })

    it('should create an action to setVersion', () => {
        const payload = "0.9.1"
        const expectedAction = {
            payload: payload,
            type: actions.dict.SET_GOLEM_VERSION
        }
        expect(actions.setVersion(payload)).toEqual(expectedAction)
    })

    it('should create an action to startGolem', () => {
        const payload = true
        const expectedAction = {
            payload: payload,
            type: actions.dict.START_GOLEM
        }
        expect(actions.startGolem(payload)).toEqual(expectedAction)
    })

    it('should create an action to stopGolem', () => {
        const expectedAction = {
            type: actions.dict.STOP_GOLEM
        }
        expect(actions.stopGolem()).toEqual(expectedAction)
    })

    it('should create an action to skipPortError', () => {
        const expectedAction = {
            type: actions.dict.CONTINUE_WITH_PROBLEM
        }
        expect(actions.skipPortError()).toEqual(expectedAction)
    })

    it('should create an action to setGolemStatus', () => {
        const payload = "Started"
        const expectedAction = {
            payload: payload,
            type: actions.dict.SET_GOLEM_STATUS
        }
        expect(actions.setGolemStatus(payload)).toEqual(expectedAction)
    })

    it('should create an action to setPauseStatus', () => {
        const payload = "Stopped"
        const expectedAction = {
            payload: payload,
            type: actions.dict.SET_GOLEM_PAUSE_STATUS
        }
        expect(actions.setPauseStatus(payload)).toEqual(expectedAction)
    })

    it('should create an action to start loading', () => {
        const id = "MAIN_LOADER"
        const text = "I am loading!"
        const expectedAction = {
            type: "START_LOADING",
            id,
            text
        }
        expect(actions.startLoading(id, text)).toEqual(expectedAction)
    })

    it('should create an action to end loading', () => {
        const id = "MAIN_LOADER"
        const expectedAction = {
            type: "END_LOADING",
            id
        }
        expect(actions.endLoading(id)).toEqual(expectedAction)
    })

    it('should create an action to login', () => {
        const payload = "Muhammed"
        const expectedAction = {
            type:  actions.dict.LOGIN,
            payload
        }
        expect(actions.login(payload)).toEqual(expectedAction)
    })

    it('should create an action to logout', () => {
        const expectedAction = {
            type: actions.dict.LOGOUT
        }
        expect(actions.logout()).toEqual(expectedAction)
    })

    it('should create an action to loginFrame', () => {
        const payload = "Muhammed"
        const expectedAction = {
            type: actions.dict.LOGIN_FRAME,
            payload
        }
        expect(actions.loginFrame(payload)).toEqual(expectedAction)
    })

    it('should create an action to logoutFrame', () => {
        const expectedAction = {
            type: actions.dict.LOGOUT_FRAME
        }
        expect(actions.logoutFrame()).toEqual(expectedAction)
    })

    it('should create an action to setBalance', () => {
        const payload = { gnt: 100, eth: 100 }
        const expectedAction = {
            type: actions.dict.SET_BALANCE,
            payload
        }
        expect(actions.setBalance(payload)).toEqual(expectedAction)
    })

    it('should create an action to setTaskList', () => {
        const payload = [{ id: 0 }]
        const expectedAction = {
            type: actions.dict.SET_TASKLIST,
            payload
        }
        expect(actions.setTaskList(payload)).toEqual(expectedAction)
    })

    it('should create an action to deleteTask', () => {
        const payload = { id: 0 }
        const expectedAction = {
            type: actions.dict.DELETE_TASK,
            payload
        }
        expect(actions.deleteTask(payload)).toEqual(expectedAction)
    })

    it('should create an action to createTask', () => {
        const payload = { id: 0 }
        const expectedAction = {
            type: actions.dict.CREATE_TASK,
            payload
        }
        expect(actions.createTask(payload)).toEqual(expectedAction)
    })

    it('should create an action to restartTask', () => {
        const payload = { id: 0 }
        const expectedAction = {
            type: actions.dict.RESTART_TASK,
            payload
        }
        expect(actions.restartTask(payload)).toEqual(expectedAction)
    })

    it('should create an action to restartFrame', () => {
        const payload = { id: 0 }
        const expectedAction = {
            type: actions.dict.RESTART_FRAME,
            payload
        }
        expect(actions.restartFrame(payload)).toEqual(expectedAction)
    })

    it('should create an action to restartSubtask', () => {
        const payload = { id: 0 }
        const expectedAction = {
            type: actions.dict.RESTART_SUBTASK,
            payload
        }
        expect(actions.restartSubtask(payload)).toEqual(expectedAction)
    })

    it('should create an action to runTestTask', () => {
        const payload = { id: 0 }
        const expectedAction = {
            type: actions.dict.RUN_TEST_TASK,
            payload
        }
        expect(actions.runTestTask(payload)).toEqual(expectedAction)
    })

    it('should create an action to setTaskTestStatus', () => {
        const payload = { id: 0 }
        const expectedAction = {
            type: actions.dict.SET_TASK_TEST_STATUS,
            payload
        }
        expect(actions.setTaskTestStatus(payload)).toEqual(expectedAction)
    })

    it('should create an action to getEstimatedCost', () => {
        const payload = { cost: 1.8 }
        const expectedAction = {
            type: actions.dict.GET_ESTIMATED_COST,
            payload
        }
        expect(actions.getEstimatedCost(payload)).toEqual(expectedAction)
    })

    it('should create an action to setEstimatedCost', () => {
        const payload = { cost: 1.8 }
        const expectedAction = {
            type: actions.dict.SET_ESTIMATED_COST,
            payload
        }
        expect(actions.setEstimatedCost(payload)).toEqual(expectedAction)
    })

    it('should create an action to clearTaskPlain', () => {
        const expectedAction = {
            type: actions.dict.CLEAR_TASK_PLAIN
        }
        expect(actions.clearTaskPlain()).toEqual(expectedAction)
    })

    it('should create an action to getTaskPresets', () => {
        const payload = [{ id: 0 }]
        const expectedAction = {
            type: actions.dict.GET_TASK_PRESETS,
            payload
        }
        expect(actions.getTaskPresets(payload)).toEqual(expectedAction)
    })

    it('should create an action to saveTaskPreset', () => {
        const payload = { id: 0 }
        const expectedAction = {
            type: actions.dict.SAVE_TASK_PRESET,
            payload
        }
        expect(actions.saveTaskPreset(payload)).toEqual(expectedAction)
    })

    it('should create an action to deleteTaskPreset', () => {
        const payload = { id: 0 }
        const expectedAction = {
            type: actions.dict.DELETE_TASK_PRESET,
            payload
        }
        expect(actions.deleteTaskPreset(payload)).toEqual(expectedAction)
    })

    it('should create an action to setFooterInfo', () => {
        const payload = "Ready for tasks"
        const expectedAction = {
            type: actions.dict.SET_FOOTER_INFO,
            payload
        }
        expect(actions.setFooterInfo(payload)).toEqual(expectedAction)
    })

    it('should create an action to setPreviewRadio', () => {
        const payload = true
        const expectedAction = {
            type: actions.dict.SET_PREVIEW_RADIO,
            payload
        }
        expect(actions.setPreviewRadio(payload)).toEqual(expectedAction)
    })

    it('should create an action to setPreviewExpanded', () => {
        const payload = true
        const expectedAction = {
            type: actions.dict.SET_PREVIEW_EXPANDED,
            payload
        }
        expect(actions.setPreviewExpanded(payload)).toEqual(expectedAction)
    })

    it('should create an action to setCurrency', () => {
        const payload = { usd: 0.02 }
        const expectedAction = {
            type: actions.dict.SET_CURRENCY,
            payload
        }
        expect(actions.setCurrency(payload)).toEqual(expectedAction)
    })

    it('should create an action to setZoomRatio', () => {
        const payload = 0.54
        const expectedAction = {
            type: actions.dict.SET_ZOOM_RATIO,
            payload
        }
        expect(actions.setZoomRatio(payload)).toEqual(expectedAction)
    })

    it('should create an action to setNetworkInfo', () => {
        const payload = {id: 0 }
        const expectedAction = {
            type: actions.dict.SET_NETWORK_INFO,
            payload
        }
        expect(actions.setNetworkInfo(payload)).toEqual(expectedAction)
    })

    it('should create an action to toggleDeveloperMode', () => {
        const payload = true
        const expectedAction = {
            type: actions.dict.TOGGLE_DEVELOPER_MODE,
            payload
        }
        expect(actions.toggleDeveloperMode(payload)).toEqual(expectedAction)
    })

    it('should create an action to setConnectionProblem', () => {
        const payload = true
        const expectedAction = {
            type: actions.dict.SET_CONNECTION_PROBLEM,
            payload
        }
        expect(actions.setConnectionProblem(payload)).toEqual(expectedAction)
    })

    it('should create an action to setFileCheck', () => {
        const payload = true
        const expectedAction = {
            type: actions.dict.SET_FILE_CHECK,
            payload
        }
        expect(actions.setFileCheck(payload)).toEqual(expectedAction)
    })

    it('should create an action to showTrust', () => {
        const payload = true
        const expectedAction = {
            type: 'TRUST_PAGE',
            payload
        }
        expect(actions.showTrust(payload)).toEqual(expectedAction)
    })

    it('should create an action to recountBenchmark', () => {
        const expectedAction = {
            type: actions.dict.RECOUNT_BENCHMARK
        }
        expect(actions.recountBenchmark()).toEqual(expectedAction)
    })
})
