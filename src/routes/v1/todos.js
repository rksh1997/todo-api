import { Router } from 'express';

import * as todoController from '../../controllers/todoController';

const router = Router();

router.param('id', todoController.ensureTodoExists);

router
  .route('/')
  /**
   * @api {post} /todos Create Todo
   * @apiName CreateTodo
   * @apiGroup Todo
   * @apiVersion 1.0.0
   *
   * @apiHeader Authorization User auth token prefixed with 'Bearer '
   *
   * @apiParam {String{1..1000}} title Todo title.
   * @apiParam {String{1..1000}} [description] Todo description.
   *
   * @apiSuccessExample {json} Success-Response:
   *  HTTP/1.1 201 CREATED
   *  {
   *    "status": 201,
   *    "response": {
   *      "todo": {
   *        "_id": "507f1f77bcf86cd799439011",
   *        "title": "Learn Node.js",
   *        "description": "Super awesome runtime environment",
   *        "user": "5d44593e4bc2151ff7c45b89",
   *        "trashed": false,
   *        "complete": false,
   *        "createdAt": "2019-08-02T16:04:21.142Z",
   *        "updatedAt": "2019-08-02T16:04:21.142Z"
   *      }
   *    }
   *  }
   */
  .post(todoController.createTodo)
  /**
   * @api {get} /todos List Todos
   * @apiName ListTodos
   * @apiGroup Todo
   * @apiVersion 1.0.0
   *
   * @apiHeader Authorization User auth token prefixed with 'Bearer '
   *
   * @apiSuccessExample {json} Success-Response:
   *  HTTP/1.1 200 OK
   *  [
   *    {
   *      "status": 200,
   *      "response": {
   *        "todos": [
   *          {
   *            "trashed": false,
   *            "complete": false,
   *            "_id": "5d445f05367b76276a210da3",
   *            "title": "Learn Node.js",
   *            "description": "Super awesome runtime environment",
   *            "user": "5d44593e4bc2151ff7c45b89",
   *            "createdAt": "2019-08-02T16:04:21.142Z",
   *            "updatedAt": "2019-08-02T16:04:21.142Z",
   *          }
   *        ]
   *      }
   *    }
   *  ]
   */
  .get(todoController.listTodos);

router
  .route('/:id')
  /**
   * @api {delete} /todos/:id Delete Todo
   * @apiName DeleteTodo
   * @apiGroup Todo
   * @apiVersion 1.0.0
   *
   * @apiHeader Authorization User auth token prefixed with 'Bearer '
   *
   * @apiSuccessExample {json} Success-Response:
   *  HTTP/1.1 202 ACCEPTED
   *  {
   *    "status": 202,
   *    "response": {
   *      "todo": {
   *        "_id": "507f1f77bcf86cd799439011",
   *        "title": "Learn Node.js",
   *        "description": "Super awesome runtime environment",
   *        "user": "5d44593e4bc2151ff7c45b89",
   *        "trashed": true,
   *        "complete": false,
   *        "createdAt": "2019-08-02T16:04:21.142Z",
   *        "updatedAt": "2019-08-02T16:04:21.142Z"
   *      }
   *    }
   *  }
   */
  .delete(todoController.deleteTodo);

router
  .route('/:id/trash')
  /**
   * @api {put} /todos/:id/trash Trash Todo
   * @apiName TrashTodo
   * @apiGroup Todo
   * @apiVersion 1.0.0
   *
   * @apiHeader Authorization User auth token prefixed with 'Bearer '
   *
   * @apiSuccessExample {json} Success-Response:
   *  HTTP/1.1 202 ACCEPTED
   *  {
   *    "status": 202,
   *    "response": {
   *      "todo": {
   *        "_id": "507f1f77bcf86cd799439011",
   *        "title": "Learn Node.js",
   *        "description": "Super awesome runtime environment",
   *        "user": "5d44593e4bc2151ff7c45b89",
   *        "trashed": true,
   *        "complete": false,
   *        "createdAt": "2019-08-02T16:04:21.142Z",
   *        "updatedAt": "2019-08-02T16:04:21.142Z"
   *      }
   *    }
   *  }
   */
  .put(todoController.trashTodo);

router
  .route('/:id/untrash')
  /**
   * @api {put} /todos/:id/untrash Untrash Todo
   * @apiName UntrashTodo
   * @apiGroup Todo
   * @apiVersion 1.0.0
   *
   * @apiHeader Authorization User auth token prefixed with 'Bearer '
   *
   * @apiSuccessExample {json} Success-Response:
   *  HTTP/1.1 202 ACCEPTED
   *  {
   *    "status": 202,
   *    "response": {
   *      "todo": {
   *        "_id": "507f1f77bcf86cd799439011",
   *        "title": "Learn Node.js",
   *        "description": "Super awesome runtime environment",
   *        "user": "5d44593e4bc2151ff7c45b89",
   *        "trashed": false,
   *        "complete": false,
   *        "createdAt": "2019-08-02T16:04:21.142Z",
   *        "updatedAt": "2019-08-02T16:04:21.142Z"
   *      }
   *    }
   *  }
   */
  .put(todoController.untrashTodo);

router
  .route('/:id/complete')
  /**
   * @api {put} /todos/:id/complete Complete Todo
   * @apiName CompleteTodo
   * @apiGroup Todo
   * @apiVersion 1.0.0
   *
   * @apiHeader Authorization User auth token prefixed with 'Bearer '
   *
   * @apiSuccessExample {json} Success-Response:
   *  HTTP/1.1 202 ACCEPTED
   *  {
   *    "status": 202,
   *    "response": {
   *      "todo": {
   *        "_id": "507f1f77bcf86cd799439011",
   *        "title": "Learn Node.js",
   *        "description": "Super awesome runtime environment",
   *        "user": "5d44593e4bc2151ff7c45b89",
   *        "trashed": false,
   *        "complete": true,
   *        "createdAt": "2019-08-02T16:04:21.142Z",
   *        "updatedAt": "2019-08-02T16:04:21.142Z"
   *      }
   *    }
   *  }
   */
  .put(todoController.completeTodo);

export default router;
