import { take, call } from 'redux-saga/effects'
import { dict } from '../actions'
import Resumable from 'resumablejs'

const {UPLOAD} = dict

/**
 * { setupResumable function, creating resumable object to upload files.}
 * @param  {[Object]} session [Websocket connection]
 * @return {[Object]}         [Resumable Object]
 */
export function setupResumable(session) {
    /**
     * [r Resumable is a file upload library]
     * @type {Resumable}
     * @doc http://www.resumablejs.com/
     */
    return new Resumable({
        target: 'upload',
        uploadMethod: 'POST',
        testMethod: 'POST',
        chunkSize: 1 * 1024 * 1024,
        forceChunkSize: true, // https://github.com/23/resumable.js/issues/51
        simultaneousUploads: 4,
        testChunks: false,
        query: {
            on_progress: 'com.example.upload.on_progress',
            session: session.getSessionId(),
            chunk_extra: JSON.stringify({
                test: 'lala',
                test2: 23
            }),
            finish_extra: JSON.stringify({
                test: 'fifi',
                test2: 52
            })
        }
    });
}

/**
 * { uploadResumable function, adding all file objects to the queue for upload }
 * 
 * @param  {[Object]}       r               [Resumable object]
 * @param  {[FileList]}     payload         [Filelist]
 * @return nothing
 */
export function uploadResumable(r, {path="", file}) {
    if (!r.support) {
        console.log("Fatal: ResumableJS not supported!");
    } else {

        console.log(path, file)
        r.addFile(file)

        /*if (document.getElementById('dragbox'))
            r.assignDrop(document.getElementById('dragbox'));*/

        r.on('fileAdded', function(file) {
            file.fileName = path + file.fileName
            console.log('fileAdded', file.fileName);
            r.upload();
        });

        r.on('fileSuccess', function(file, message) {
            console.log('fileSuccess', file, message);
            console.log(r.files);

            // enable repeated upload since other user can delete the file on the server
            // and this user might want to reupload the file
            r.removeFile(file)
        });

        r.on('fileError', function(file, message) {
            console.log('fileError', file, message);
            r.removeFile(file)
        });
    }
}

/**
 * { Upload Generator, waiting for uploads from the redux and sending them to the backend }
 *
 * @param      {Object}  connection  The connection of ws
 * @param      {Object}  session     The session of connection of ws
 * @return     {boolean}            { job isDone status }
 */
export function* uploadFlow(session) {
    while (true) {
        const resumableObject = yield call(setupResumable, session);
        const {payload} = yield take(UPLOAD);
        console.log(payload)
        yield call(uploadResumable, resumableObject, payload)
    }
}