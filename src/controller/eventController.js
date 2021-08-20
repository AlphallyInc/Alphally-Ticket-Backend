/* eslint-disable max-len */
import { GeneralService, EventService } from '../services';
import { Toolbox, Helpers } from '../utils';
import database from '../models';

const {
  successResponse,
  errorResponse,
  mergeImageVideoUrls
} = Toolbox;
const {
  addEntity,
  updateByKey,
  findByKey,
  deleteByKey,
  allEntities,
  findMultipleByKey
} = GeneralService;
const {
  uploadAllImages,
  uploadAllVideos
} = Helpers;
const {
  recursiveCategories,
  getEventByKey
} = EventService;
const {
  PostMedia,
  EventMedia,
  Event,
  Post,
  Media,
  EventCategory,
  MovieGenre,
  Category,
} = database;

const EventController = {
  /**
   * add a event and a post
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof EventController
   */
  async addEvent(req, res) {
    try {
      let body;
      let media;
      let thumbnailUrl;
      let mediaTrailer;
      const { id } = req.tokenData;
      const postBody = req.body.post;
      const { categoryIds, mediaIds } = req.body;
      delete req.body.post;
      delete req.body.categoryIds;
      delete req.body.mediaIds;

      if (!req.body.numberOfTickets) req.body = { ...req.body, isAvialable: false };
      else if (req.body.numberOfTickets <= 0) req.body = { ...req.body, isAvialable: false };
      else req.body = { ...req.body, isAvialable: true };
      if (req.body.trailer) mediaTrailer = await findByKey(Media, { url: req.body.trailer });
      if (req.body.thumbnailId) thumbnailUrl = await findByKey(Media, { id: req.body.thumbnailId });
      if (thumbnailUrl) body = { ...req.body, trailer: thumbnailUrl.url, userId: id };
      const event = await addEntity(Event, body);
      const movieCategoryPayload = categoryIds.map((item) => ({ eventId: event.id, categoryId: Number(item) }));
      await EventCategory.bulkCreate(movieCategoryPayload);
      const mediaMoviePayload = mediaIds.map((item) => ({ mediaId: Number(item), eventId: event.id }));
      if (thumbnailUrl) mediaMoviePayload.unshift({ mediaId: req.body.thumbnailId, eventId: event.id });
      if (mediaTrailer) mediaMoviePayload.unshift({ mediaId: mediaTrailer.id, eventId: event.id });
      const eventMedia = await EventMedia.bulkCreate(mediaMoviePayload);
      if (event && eventMedia) {
        if (postBody) {
          const post = await addEntity(Post, { ...postBody, userId: id, eventId: event.id });
          const mediaPostPayload = mediaIds.map((item) => ({ mediaId: Number(item), postId: post.id }));
          if (thumbnailUrl) mediaPostPayload.unshift({ mediaId: req.body.thumbnailId, postId: post.id });
          if (mediaTrailer) mediaPostPayload.unshift({ mediaId: mediaTrailer.id, postId: post.id });
          await PostMedia.bulkCreate(mediaPostPayload);
          await updateByKey(Event, { postId: post.id }, { id: event.id });
        }
      }
      return successResponse(res, {
        message: 'Event Added Successfully', event, eventMedia
      });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * add categories
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof EventController
   */
  async addCategory(req, res) {
    try {
      const payload = req.body.category.map((item) => ({ decription: item.description, name: item.name.toLowerCase() }));
      // return console.log(payload);
      await recursiveCategories(payload);
      return successResponse(res, { message: 'Categories Added Successfully' });
    } catch (error) {
      console.error(error);
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * update update category
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof EventController
   */
  async updateCategory(req, res) {
    try {
      const { id } = req.query;
      let category = await findByKey(Category, { id });
      if (!category) return errorResponse(res, { code: 404, message: 'Category does not exist' });
      category = await updateByKey(Category, { ...req.body }, { id });
      return successResponse(res, { message: 'Category Updated Successfully', category });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * delete category
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof EventController
   */
  async deleteCateory(req, res) {
    try {
      const { id } = req.query;
      const category = await findByKey(Category, { id });
      if (!category) return errorResponse(res, { code: 404, message: 'Category does not exist' });
      await deleteByKey(Category, { id });
      return successResponse(res, { message: 'Category Deleted Successfully' });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * get all genres
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof EventController
   */
  async getCategory(req, res) {
    try {
      const category = await allEntities(Category);
      return successResponse(res, { message: 'Category Gotten Successfully', category });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * delete a event and a post
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof EventController
   */
  async deleteEvent(req, res) {
    try {
      const { event } = req;
      const { postId, id } = event;
      let medias = await findMultipleByKey(EventMedia, { eventId: event.id });
      if (medias.length > 0) {
        medias = medias.map(({ mediaId }) => mediaId);
        await deleteByKey(Media, { id: medias });
        await deleteByKey(EventMedia, { mediaId: medias });
      }
      if (postId !== null) await deleteByKey(Post, { id: postId });
      await deleteByKey(Event, { id });
      return successResponse(res, { message: 'Event Added Successfully' });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * update a event and a post
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof EventController
   */
  async updateEvent(req, res) {
    try {
      // if (req.body.categoryIds) ;
      const event = await updateByKey(Event, { ...req.body }, { id: req.event.id });
      return successResponse(res, { message: 'Event updated Successfully', event });
    } catch (error) {
      errorResponse(res, { code: 500, message: error });
    }
  },

  /**
   * get a event and a post
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof EventController
   */
  async getEvent(req, res) {
    try {
      let eventData;
      const { id, privacyId } = req.query;
      if (id) eventData = await getEventByKey({ id });
      else if (privacyId) eventData = await getEventByKey({ privacyId });
      else eventData = await getEventByKey({});
      return successResponse(res, { message: 'Event Gotten Successfully', eventData });
    } catch (error) {
      console.error(error);
      errorResponse(res, { code: 500, message: error });
    }
  },
};

export default EventController;
