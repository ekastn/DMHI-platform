from flask import Blueprint, request
from flask_login import current_user

from app import db
from app.helper.http import create_response
from app.models.story import Story
from app.models.pin import Pin

story = Blueprint("story", __name__, url_prefix="/api")

def story_payload(story: Story):
    return {
        "id": story.id,
        "title": story.title,
        "content": story.content,
        "created_at": story.created_at,
        "updated_at": story.updated_at,
        "user": story.user.username,
        "pin": {
            "latitude": story.pin.latitude,
            "longitude": story.pin.longitude,
        },
    }


@story.route("/story/", methods=["POST"])
def create_story():
    if not current_user.is_authenticated:
        return create_response(success=False, message="User not authenticated", status_code=401)

    data = request.get_json()
    title = data.get("title")
    content = data.get("content")
    latitude = data.get("latitude")
    longitude = data.get("longitude")

    try:
        story = Story(title=title, content=content, user_id=current_user.id)
        db.session.add(story)
        db.session.commit() 

        pin = Pin(latitude=latitude, longitude=longitude, story_id=story.id) 
        db.session.add(pin)
        db.session.commit() 

        return create_response(success=True, message="Story created", data={"story": story_payload(story)})
    
    except Exception as e:
        db.session.rollback() 
        print(e)
        return create_response(success=False, message=e, status_code=500)

# ------------------------------------------
@story.route("/story/", methods=["GET"])
def get_stories():
    stories = Story.query.all()
    return create_response(success=True, message="Stories retrieved", data={"stories": [story_payload(story) for story in stories]})

@story.route("/story/<int:story_id>", methods=["GET"])
def get_story(story_id):
    story = Story.query.get(story_id)
    if not story:
        return create_response(success=False, message="Story not found", status_code=404)
    return create_response(success=True, message="Story retrieved", data={"story": story_payload(story)})

@story.route("/story/<int:story_id>", methods=["PUT"])
def update_story(story_id):
    if not current_user.is_authenticated:
        return create_response(success=False, message="User not authenticated", status_code=401)
        
    data = request.get_json()
    story = Story.query.get(story_id)
    story.title = data.get("title")
    story.content = data.get("content")
    
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return create_response(success=False, message="Failed to update story", status_code=500)
    
    return create_response(success=True, message="Story updated", data={"story": story_payload(story)})

@story.route("/story/<int:story_id>", methods=["DELETE"])
def delete_story(story_id):
    if not current_user.is_authenticated:
        return create_response(success=False, message="User not authenticated", status_code=401)
    
    story = Story.query.get(story_id)
   
    if not story:
        return create_response(success=False, message="Story not found", status_code=404)
    
    try:
        pin = Pin.query.filter_by(story_id=story_id).first()
        if pin:
            db.session.delete(pin)
            
        db.session.delete(story)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting story: {e}") 
        return create_response(success=False, message="Failed to delete story", status_code=500)

    return create_response(success=True, message="Story deleted")
