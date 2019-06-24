import tensorflow as tf

class Denoiser:
    def __init__(self, pretrained_path):
        self.model = tf.keras.models.load_model(pretrained_path)
        self.graph = tf.get_default_graph()

    def predict(self, inputs):
        with self.graph.as_default():
            predictions = self.model.predict(inputs)
            return predictions
