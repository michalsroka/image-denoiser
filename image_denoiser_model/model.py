import tensorflow as tf

class Denoiser:
    def __init__(self, pretrained_path):
        self.model = tf.keras.models.load_model(pretrained_path)
        self.graph = tf.get_default_graph()

    def predict(self, inputs):
        with self.graph.as_default():
            x = inputs.reshape(1, 48, 48, 3)
            predictions = self.model.predict(x)
            return predictions.reshape(48, 48, 3)
