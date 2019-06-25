import os.path

import flask
import numpy as np
from flask import json
from flask_cors import CORS

import image_denoiser_model.model as tf_model
import image_denoiser_service.handlers as handlers

PRETRAINED_PATH = os.environ['PRETRAINED_PATH'] if 'PRETRAINED_PATH' in os.environ else os.path.join(
    '..',
    'image_denoiser_model',
    'pretrained',
    'model.h5')
PORT = os.environ['PORT'] if 'PORT' in os.environ else 8080

app = flask.Flask(__name__)

CORS(app)


def get_model():
    model = getattr(flask.g, '_model', None)

    if model is None:
        model = flask.g._model = tf_model.Denoiser(PRETRAINED_PATH)

    return model


def _parse__predict_request():
    query = flask.request.get_json(silent=False)
    query['images']['img'] = np.array(query['images']['img'])

    if 'label' in query['images']:
        query['images']['label'] = np.array(query['images']['label'])

    assert query['images']['img'].shape == (1, 48, 48, 3) or query['images']['img'].shape == (
        48, 48, 3), 'Image shape is not (1, 48, 48, 3)'

    return query


@app.route('/predict', methods=['POST'])
def predict():
    try:
        query = _parse__predict_request()

        for handler in handlers.mongo_handlers:
            handler(query)

        model = get_model()
        preds = np.rint((np.array(model.predict(query['images']['img'] / 255.)).reshape(48, 48, 3) * 255)).tolist()

        response = app.response_class(
            response=json.dumps({'images': preds}),
            status=200,
            mimetype='application/json'
        )

    except Exception as e:
        err_msg = f'Expected json format {{images: {{img: []}} }}, Python ex message: {e}'
        response = app.response_class(
            response=json.dumps({'err': err_msg}),
            status=400,
            mimetype='application/json'
        )
    return response


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT, threaded=False)
