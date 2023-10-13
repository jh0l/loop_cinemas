import {
  Association,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManySetAssociationsMixin,
  HasManyAddAssociationsMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  Model,
  ModelDefined,
  Optional,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  ForeignKey,
} from "sequelize";

// 'mysql://root:asd123@localhost:3306/mydb'
const sequelize = new Sequelize(
  "mysql://s3585034_fwp_a2:c7nxhabGPSnSfluW@rmit.australiaeast.cloudapp.azure.com:3306/s3585034_fwp_a2"
);

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare user_id: CreationOptional<string>;
  declare name: string;
  declare email: string;
  declare password: string;
  declare created_at: CreationOptional<Date>;

  declare getReviews: HasManyGetAssociationsMixin<Review>;
  declare countReviews: HasManyCountAssociationsMixin;
  declare hasReview: HasManyHasAssociationMixin<Review, string>;
  declare hasReviews: HasManyHasAssociationsMixin<Review, string>;
  declare setReviews: HasManySetAssociationsMixin<Review, string>;
  declare addReview: HasManyAddAssociationMixin<Review, string>;
  declare addReviews: HasManyAddAssociationsMixin<Review, string>;
  declare createReview: HasManyCreateAssociationMixin<Review>;
  declare removeReview: HasManyRemoveAssociationMixin<Review, string>;
  declare removeReviews: HasManyRemoveAssociationsMixin<Review, string>;
}

class Movie extends Model<
  InferAttributes<Movie>,
  InferCreationAttributes<Movie>
> {
  declare movie_id: CreationOptional<string>;
  declare title: string;
  declare year: string;
  declare content_rating: string;
  declare poster_url: string;
  declare plot: string;
  declare genres: string[];

  declare getReviews: HasManyGetAssociationsMixin<Review>;
  declare countReviews: HasManyCountAssociationsMixin;
  declare hasReview: HasManyHasAssociationMixin<Review, string>;
  declare hasReviews: HasManyHasAssociationsMixin<Review, string>;
  declare setReviews: HasManySetAssociationsMixin<Review, string>;
  declare addReview: HasManyAddAssociationMixin<Review, string>;
  declare addReviews: HasManyAddAssociationsMixin<Review, string>;
  declare createReview: HasManyCreateAssociationMixin<Review>;
  declare removeReview: HasManyRemoveAssociationMixin<Review, string>;
  declare removeReviews: HasManyRemoveAssociationsMixin<Review, string>;
}

class Review extends Model<
  InferAttributes<Review>,
  InferCreationAttributes<Review>
> {
  declare user_id: ForeignKey<string>;
  declare movie_id: ForeignKey<string>;
  declare rating: number;
  declare content: string;
  declare created_at: CreationOptional<Date>;
}

User.hasMany(Review, { sourceKey: "user_id", foreignKey: "user_id_f" });
Movie.hasMany(Review, { foreignKey: "movie_id_f" });

Review.belongsTo(User, { targetKey: "user_id_f" });
Review.belongsTo(Movie, { foreignKey: "movie_id_f" });

User.init(
  {
    user_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize }
);

Movie.init(
  {
    movie_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    year: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    content_rating: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    poster_url: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    plot: {
      type: DataTypes.STRING(600),
      allowNull: false,
    },
    genres: {
      type: DataTypes.ARRAY(DataTypes.STRING(128)),
      allowNull: false,
    },
  },
  { sequelize }
);

Review.init(
  {
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 5,
      },
    },
    content: {
      type: DataTypes.STRING(600),
      allowNull: false,
    },
  },
  { sequelize }
);

const model = { User, Movie, Review, sequelize };
export default model;
