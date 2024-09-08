import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';

import passport from 'passport';

import { Strategy as LocalStategy } from 'passport-local';

import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import cookieParser from 'cookie-parser';

const app = express();

const origin = {
  origin: Config.isProduction || Config.isStaginig ? 'https://' : '*',
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors(origin));
app.use(helmet());
app.use(cookieParser());
app.use(passport.initialize());

passport.use(
  new LocalStategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    authUser,
  ),
);

passport.use(
  new JwtStrategy(
    {
      // jwtFromRequest: ExtractJwt.fromExtractors([(request: any) => request?.headers.Authentication || request?.headers.authorization || request?.Authentication]),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Config.JWT_SECRET,
    },
    jwtAuth,
  ),
);

app.get('/', (req, res) => {
  res.send("yo i'm up");
});

app.use('/api/v1', v1Router);

// New api versions can go here

// initialize db
dataService
  .initialize()
  .then(() => {
    console.log('Db💾 connected...');

    app.listen(Config.PORT || 400, () => {
      console.log(`[App]: Server listening on ${Config.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });

process.on('SIGINT', () => {
  dataService.destroy();
  // Gracefully exit the process
  process.exit(0);
});

export { app };
