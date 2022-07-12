const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
          if (context.user) {
            const userData = await User.findOne({ _id: context.user._id })
              .select('-__v -password')
              .populate('thoughts')
              .populate('friends');
    
            return userData;
          }
    
          throw new AuthenticationError('Not logged in');
        },
        users: async () => {
            return User.find()
              .select('-__v -password')
              .populate('thoughts')
              .populate('friends');
          },
          user: async (parent, { username }) => {
            return User.findOne({ username })
              .select('-__v -password')
              .populate('friends')
              .populate('thoughts');
          },
          books: async (parent, { username }) => {
            const params = username ? { username } : {};
            return User.find(params).sort({ createdAt: -1 });
          },
          book: async (parent, { _id }) => {
            return User.findOne({ _id });
          }

},

Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, args, context) => {
      if (context.user) {
        
        const book = await Book.create({ ...args, username: context.user.username });

        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { book: book._id } },
          { new: true }
        );

        return thought;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const removedBook = await Book.findOneAndDelete(
          { _id: bookId },
          { $push: {...args,  username: context.user.username } },
          { new: true, runValidators: true }
        );

        return updatedBook;
      }

      throw new AuthenticationError('You need to be logged in!');
    }

    },

}
