const { AuthenticationError } = require('apollo-server-express');
const { Book, User} = require('../models');


const resolvers = {
    Query: {
     user: async () => {
        // Populate the user and book 
        return await User.find({}).populate('book');
      }
      
      
      },
      Mutation: {
        async saveBook(parent, args, {user} ) {
            console.log(user);
            try {
              const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $addToSet: { savedBooks: args } },
                { new: true, runValidators: true }
              );
              return updatedUser;
            } catch (err) {
              console.log(err);
              return new AuthenticationError("message: Couldn't update");
            }
          }
      },
      async deleteBook(parent, args, {user}) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $pull: { savedBooks: { bookId: args.bookId} } },
          { new: true }
        );
        if (!updatedUser) {
          return new AuthenticationError("message: Couldn't update");
        }
      },

      async login(parent, args) {
        const user = await User.findOne({ $or: [{ username: args.username }, { email: args.email }] });
        if (!user) {
          return new AuthenticationError("message: Couldn't update");
        }
    
        const correctPw = await user.isCorrectPassword(args.password);
    
        if (!correctPw) {
          return new AuthenticationError("message: Couldn't update");
        }
        const token = signToken(user);
        return ({ token, user });
      }
    };
   
 
  
  module.exports = resolvers;
  