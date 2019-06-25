from image_denoiser_service.mongo import hook as mongo_hook


def save_image(request):
    if 'label' not in request['images']:
        return

    document = {
        'image': request['images']['img'].tolist(),
        'label': request['images']['label'].tolist(),
        'username': request['username'],
        'trained': False,
    }

    mongo_hook.insert(document, collection=mongo_hook.collections['images'])


def update_user_stats(request):
    is_labeled = 'label' in request['images']
    mongo_hook.update_user_stats(request['username'], with_label=is_labeled)


mongo_handlers = [save_image, update_user_stats]
