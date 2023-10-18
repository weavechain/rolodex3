import Int "mo:base/Int";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import BTree "mo:StableHeapBTreeMap/BTree";
import Principal "mo:base/Principal";

shared(msg) actor class Hashes() {

  stable var currentOwner : Principal = msg.caller;

  stable var map = BTree.init<Text, Text>(?8);

  public query func count() : async Int {
    return BTree.size(map);
  };

  public query func get(id : Text) : async ?Text {
    return BTree.get<Text, Text>(map, Text.compare, id);
  };

  public query func readHashes() : async  [(Text, Text)] {
    return BTree.toArray(map);
  };

  public func owner() : async Principal {
    return currentOwner;
  };

  public shared(msg) func caller() : async Principal {
    return msg.caller;
  };

  public shared(msg) func setOwner(value: Text) : async Principal {
    assert(currentOwner == msg.caller);

    currentOwner := Principal.fromText(value);
    return currentOwner;
  };

  public shared(msg) func store(id : Text, hash : Text) : async Int {
    assert(currentOwner == msg.caller);

    let prev = BTree.insert<Text, Text>(map, Text.compare, id, hash);
    return BTree.size(map);
  };

  public shared(msg) func delete(id: Text): async Int {
    assert(currentOwner == msg.caller);

    let prev = BTree.delete<Text, Text>(map, Text.compare, id);
    return BTree.size(map);
  };

  public shared(msg) func reset(): async Int {
    assert(currentOwner == msg.caller);

    map := BTree.init<Text, Text>(?8);
    return BTree.size(map);
  };
};
