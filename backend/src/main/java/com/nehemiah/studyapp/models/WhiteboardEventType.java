package com.nehemiah.studyapp.models;

public enum WhiteboardEventType {

    // Drawing
    DRAW,

    // Erasing
    ERASE,

    // Text
    TEXT_ADD,
    TEXT_UPDATE,

    // Images
    IMAGE_ADD,
    IMAGE_UPDATE,

    // Moving/resizing objects
    OBJECT_MOVE,
    OBJECT_RESIZE,

    // Delete an individual object
    OBJECT_DELETE,

    // Board operations
    CLEAR
}
