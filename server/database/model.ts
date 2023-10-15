import {
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
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";

const sequelize = new Sequelize(
  "mysql://s3585034_fwp_a2:c7nxhabGPSnSfluW@rmit.australiaeast.cloudapp.azure.com:3306/s3585034_fwp_a2"
);

/**
 * User model for sequelize ORM, allows typescript to infer types
 */
export class user extends Model<
  InferAttributes<user>,
  InferCreationAttributes<user>
> {
  declare user_id: CreationOptional<string>;
  declare name: string;
  declare email: string;
  declare password: string | (() => string);
  declare createdAt: CreationOptional<Date | string>;
  declare updatedAt: CreationOptional<Date | string>;

  declare getReviews: HasManyGetAssociationsMixin<review>;
  declare countReviews: HasManyCountAssociationsMixin;
  declare hasReview: HasManyHasAssociationMixin<review, string>;
  declare hasReviews: HasManyHasAssociationsMixin<review, string>;
  declare setReviews: HasManySetAssociationsMixin<review, string>;
  declare addReview: HasManyAddAssociationMixin<review, string>;
  declare addReviews: HasManyAddAssociationsMixin<review, string>;
  declare createReview: HasManyCreateAssociationMixin<review>;
  declare removeReview: HasManyRemoveAssociationMixin<review, string>;
  declare removeReviews: HasManyRemoveAssociationsMixin<review, string>;
  getPassword() {
    if (typeof this.password === "function") {
      return this.password();
    } else {
      return this.password;
    }
  }
}

/**
 * Movie model for sequelize ORM, allows typescript to infer types
 */
export class movie extends Model<
  InferAttributes<movie>,
  InferCreationAttributes<movie>
> {
  declare movie_id: CreationOptional<string>;
  declare title: string;
  declare year: string;
  declare content_rating: string;
  declare poster_url: string;
  declare plot: string;
  declare genres: string;
  declare createdAt: CreationOptional<Date | string>;
  declare updatedAt: CreationOptional<Date | string>;

  declare getReviews: HasManyGetAssociationsMixin<review>;
  declare countReviews: HasManyCountAssociationsMixin;
  declare hasReview: HasManyHasAssociationMixin<review, string>;
  declare hasReviews: HasManyHasAssociationsMixin<review, string>;
  declare setReviews: HasManySetAssociationsMixin<review, string>;
  declare addReview: HasManyAddAssociationMixin<review, string>;
  declare addReviews: HasManyAddAssociationsMixin<review, string>;
  declare createReview: HasManyCreateAssociationMixin<review>;
  declare removeReview: HasManyRemoveAssociationMixin<review, string>;
  declare removeReviews: HasManyRemoveAssociationsMixin<review, string>;

  declare getSessions: HasManyGetAssociationsMixin<session>;
  declare countSessions: HasManyCountAssociationsMixin;
  declare hasSession: HasManyHasAssociationMixin<session, string>;
  declare hasSessions: HasManyHasAssociationsMixin<session, string>;
}

/**
 * Review: stores user reviews for movies
 */
export class review extends Model<
  InferAttributes<review>,
  InferCreationAttributes<review>
> {
  declare user_id: ForeignKey<string>;
  declare movie_id: ForeignKey<string>;
  declare rating: number;
  declare content: string;
  declare createdAt: CreationOptional<Date | string>;
  declare updatedAt: CreationOptional<Date | string>;
}

/**
 * Session: stores session times for movies
 */
export class session extends Model<
  InferAttributes<session>,
  InferCreationAttributes<session>
> {
  declare session_id: CreationOptional<string>;
  declare movie_id: ForeignKey<string>;
  declare date_time: Date | string;
  declare createdAt: CreationOptional<Date | string>;
  declare updatedAt: CreationOptional<Date | string>;
}

/**
 * Reservation: stores a user's reservation for a session of a movie
 */
export class reservation extends Model<
  InferAttributes<reservation>,
  InferCreationAttributes<reservation>
> {
  declare reservation_id: CreationOptional<string>;
  declare session_id: ForeignKey<string>;
  declare user_id: ForeignKey<string>;
  declare tickets: number;
  declare createdAt: CreationOptional<Date | string>;
  declare updatedAt: CreationOptional<Date | string>;
}

/**
 * user.init is called on the user model to initialise it with the sequelize ORM and define the table schema for the user table
 */
user.init(
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
      get() {
        return () => this.getDataValue("password");
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize, tableName: "user", freezeTableName: true }
);

/**
 * movie.init is called on the movie model to initialise it with the sequelize ORM and define the table schema for the movie table
 */
movie.init(
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
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize, tableName: "movie", freezeTableName: true }
);

/**
 * review.init is called on the review model to initialise it with the sequelize ORM and define the table schema for the review table
 */
review.init(
  {
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    movie_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize, tableName: "review", freezeTableName: true }
);

/**
 * session.init is called on the session model to initialise it with the sequelize ORM and define the table schema for the session table
 */
session.init(
  {
    session_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    movie_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    date_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize, tableName: "session", freezeTableName: true }
);

/**
 * reservation.init is called on the reservation model to initialise it with the sequelize ORM and define the table schema for the reservation table
 */
reservation.init(
  {
    reservation_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    session_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    tickets: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 10,
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize, tableName: "reservation", freezeTableName: true }
);

/**
 * user.hasMany is called on the user model to define the one-to-many relationship between the user and review models
 */
user.hasMany(review, { sourceKey: "user_id", foreignKey: "user_id" });
movie.hasMany(review, { sourceKey: "movie_id", foreignKey: "movie_id" });
movie.hasMany(session, { sourceKey: "movie_id", foreignKey: "movie_id" });
/**
 * review.belongsTo is called on the review model to define the one-to-one relationship between the review and user and movie models
 */
review.belongsTo(user, { foreignKey: "user_id", targetKey: "user_id" });
review.belongsTo(movie, { foreignKey: "movie_id", targetKey: "movie_id" });
