import notifs from '../data/notifs.json';
import follows from '../data/follows.json';

function getNotifs(user){
  return notifs.filter(x => x.userFor === user).reverse();
}

function getFollowing(user){
  return follows.filter(x => x.user === user)
}

function getFollowers(user){
  return follows.filter(x => x.follow === user)
}

function getUnreadsCount(user){
  return notifs.filter(x => x.userFor === user).filter(x => !x.r).length;
}

export { getNotifs, getFollowing, getFollowers, getUnreadsCount };