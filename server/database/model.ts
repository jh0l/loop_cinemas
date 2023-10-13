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

export class user extends Model<
  InferAttributes<user>,
  InferCreationAttributes<user>
> {
  declare user_id: CreationOptional<string>;
  declare name: string;
  declare email: string;
  declare password: string | (() => string);

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
  declare genres: string[];

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
}

export class review extends Model<
  InferAttributes<review>,
  InferCreationAttributes<review>
> {
  declare user_id: ForeignKey<string>;
  declare movie_id: ForeignKey<string>;
  declare rating: number;
  declare content: string;
}

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
  },
  { sequelize, tableName: "user", freezeTableName: true }
);

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
      type: DataTypes.ARRAY(DataTypes.STRING(128)),
      allowNull: false,
    },
  },
  { sequelize, tableName: "movie", freezeTableName: true }
);

review.init(
  {
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
  { sequelize, tableName: "review", freezeTableName: true }
);

user.hasMany(review, { sourceKey: "user_id", foreignKey: "user_id_f" });
movie.hasMany(review, { sourceKey: "movie_id", foreignKey: "movie_id_f" });

review.belongsTo(user, { foreignKey: "user_id_f", targetKey: "user_id" });
review.belongsTo(movie, { foreignKey: "movie_id_f", targetKey: "movie_id" });
