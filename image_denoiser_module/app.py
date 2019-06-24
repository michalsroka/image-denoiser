import os.path

import flask
import numpy as np

import image_denoiser_model.model as tf_model

PRETRAINED_PATH = os.environ['PRETRAINED_PATH'] if 'PRETRAINED_PATH' in os.environ else os.path.join('..',
                                                                                                     'image_denoiser_model',
                                                                                                     'pretrained',
                                                                                                     'model.h5')
PORT = os.environ['PORT'] if 'PORT' in os.environ else 8080

app = flask.Flask(__name__)


def get_model():
    model = getattr(flask.g, '_model', None)

    if model is None:
        model = flask.g._model = tf_model.Denoiser(PRETRAINED_PATH)

    return model


def _parse__predict_request():
    query = flask.request.get_json(silent=True)
    return np.array(query['images'])


@app.route('/predict', methods=['POST'])
def predict():
    images = _parse__predict_request().reshape(-1, 48, 48, 3)
    model = get_model()
    preds = model.predict(images).reshape(-1, 48, 48, 3).tolist()
    response = {'images': preds}

    return flask.jsonify(response)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT)
